import { GraphicObject } from './graphic_object.js';
import { Circle } from '../form/circle.js';

// for rev surfaces the curve has to be in the plane xz
export class RevSurface extends GraphicObject {
  constructor(steps, form, gl, glProgram, color, texture, u_factor, v_factor) {
    super(gl, steps + 1, form.len(), glProgram, color, texture);
    this.form = form;
    this.steps = steps;
    this.createSurface(steps, u_factor || 1.0, v_factor || 1.0);
  }

  createSurface(steps, u_factor, v_factor) {
    const { gl } = this;
    const { vec4 } = glMatrix;
    const { vec3 } = glMatrix;
    const { form } = this;
    const fromLen = form.len();
    let formVertice;
    let point;
    let normal;
    const pos = [];
    const normals = [];
    const uv = [];
    const circle = new Circle(steps, 0);

    for (let u = 0; u <= steps; u++) {
      const { levelMatrix, normalMatrix } = this.levelMatrix(circle.vertice(u));
      for (let i = 0; i < fromLen; i++) {
        formVertice = form.vertice(i);
        point = formVertice.position;
        point = vec4.fromValues(point.x, point.y, point.z, 1);
        const newPoint = vec4.create();
        vec4.transformMat4(newPoint, point, levelMatrix);

        pos.push(newPoint[0]);
        pos.push(newPoint[1]);
        pos.push(newPoint[2]);

        normal = formVertice.normal;
        normal = vec3.fromValues(normal.x, normal.y, normal.z);
        const newNormal = vec4.create();
        vec3.transformMat3(newNormal, normal, normalMatrix);

        normals.push(newNormal[0]);
        normals.push(newNormal[1]);
        normals.push(newNormal[2]);

        uv.push((u / steps) * u_factor);
        uv.push((i / fromLen) * v_factor);
      }
    }

    const trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    this.trianglesVerticeBuffer = trianglesVerticeBuffer;

    const trianglesNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    this.trianglesNormalBuffer = trianglesNormalBuffer;

    const trianglesUvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    this.trianglesUvBuffer = trianglesUvBuffer;
  }

  levelMatrix(vertice) {
    const { mat4 } = glMatrix;
    const { mat3 } = glMatrix;
    const { vec3 } = glMatrix;
    let point = vertice.position;
    let { normal } = vertice;
    point = vec3.fromValues(point.x, point.y, point.z);
    normal = vec3.fromValues(normal.x, normal.y, normal.z);
    const tangent = vec3.create();
    vec3.cross(tangent, normal, vec3.fromValues(0, 0, -1));
    const binormal = vec3.create();
    vec3.cross(binormal, normal, tangent);

    vec3.normalize(normal, normal);
    vec3.normalize(binormal, binormal);
    vec3.normalize(tangent, tangent);

    const levelMatrix = mat4.fromValues(
      normal[0],
      normal[1],
      normal[2],
      0,
      binormal[0],
      binormal[1],
      binormal[2],
      0,
      tangent[0],
      tangent[1],
      tangent[2],
      0,
      point[0],
      point[1],
      point[2],
      1,
    );

    const normalMatrix = mat3.fromValues(
      normal[0],
      normal[1],
      normal[2],
      binormal[0],
      binormal[1],
      binormal[2],
      tangent[0],
      tangent[1],
      tangent[2],
    );

    return { levelMatrix, normalMatrix };
  }

  draw() {
    const { gl } = this;
    const { glProgram } = this;
    const { trianglesVerticeBuffer } = this;
    const { trianglesNormalBuffer } = this;
    const { trianglesUvBuffer } = this;

    const vertexPositionAttribute = gl.getAttribLocation(glProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    const vertexNormalAttribute = gl.getAttribLocation(glProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    const vertexUvAttribute = gl.getAttribLocation(glProgram, 'aUv');
    gl.enableVertexAttribArray(vertexUvAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
    gl.vertexAttribPointer(vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

    super.draw();
  }
}
