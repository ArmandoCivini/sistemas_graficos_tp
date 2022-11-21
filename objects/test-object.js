import { GraphicObject } from './graphic_object.js';

export class TestObject extends GraphicObject {
  constructor(gl, rows, cols, glProgram) {
    super(gl, rows, cols, glProgram);
    const pos = [];
    const normal = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const alfa = j / (cols - 1) * Math.PI * 2;
        const beta = (0.1 + i / (rows - 1) * 0.8) * Math.PI;

        const p = this.getPos(alfa, beta);

        pos.push(p[0]);
        pos.push(p[1]);
        pos.push(p[2]);

        const n = this.getNrm(alfa, beta);

        normal.push(n[0]);
        normal.push(n[1]);
        normal.push(n[2]);
      }
    }

    const trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    this.trianglesVerticeBuffer = trianglesVerticeBuffer;

    const trianglesNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    this.trianglesNormalBuffer = trianglesNormalBuffer;
  }

  draw() {
    const { gl } = this;
    const { glProgram } = this;
    const { trianglesVerticeBuffer } = this;
    const { trianglesNormalBuffer } = this;

    const vertexPositionAttribute = gl.getAttribLocation(glProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    const vertexNormalAttribute = gl.getAttribLocation(glProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    super.draw();
  }

  getPos(alfa, beta) {
    const r = 2;
    const nx = Math.sin(beta) * Math.sin(alfa);
    const ny = Math.sin(beta) * Math.cos(alfa);
    const nz = Math.cos(beta);

    const g = beta % 0.5;
    const h = alfa % 1;
    let f = 1;

    if (g < 0.25) f = 0.95;
    if (h < 0.5) f *= 0.95;

    const x = nx * r * f;
    const y = ny * r * f;
    const z = nz * r * f;

    return [x, y, z];
  }

  getNrm(alfa, beta) {
    const { vec3 } = glMatrix;
    const p = this.getPos(alfa, beta);
    const v = vec3.create();
    vec3.normalize(v, p);

    const delta = 0.05;
    const p1 = this.getPos(alfa, beta);
    const p2 = this.getPos(alfa, beta + delta);
    const p3 = this.getPos(alfa + delta, beta);

    const v1 = vec3.fromValues(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
    const v2 = vec3.fromValues(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);

    vec3.normalize(v1, v1);
    vec3.normalize(v2, v2);

    const n = vec3.create();
    vec3.cross(n, v1, v2);
    vec3.scale(n, n, -1);
    return n;
  }
}
