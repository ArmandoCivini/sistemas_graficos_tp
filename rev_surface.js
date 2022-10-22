import {GraphicObject} from "./graphic_object.js";
import {Circle} from "./circle.js";

//for rev surfaces the curve has to be in the plane xz
export class RevSurface extends GraphicObject {
    constructor(steps, form, gl, glProgram, color) {
        super(gl, steps+1, form.len(), glProgram, color);
        this.form = form;
        this.steps = steps;
        this.createSurface(steps);
    }

    createSurface(steps) {
        let gl = this.gl;
        var vec4=glMatrix.vec4;
        var vec3=glMatrix.vec3;
        let form = this.form;
        let formVertice;
        let point;
        let normal;
        let pos = [];
        let normals = [];
        let circle = new Circle(steps, 0);
        
        for(let u=0; u <= steps; u++) {
            const {levelMatrix, normalMatrix} = this.levelMatrix(circle.vertice(u));
            for(let i=0; i < form.len(); i++) {
                formVertice = form.vertice(i);
                point = formVertice.position;
                point = vec4.fromValues(point.x, point.y, point.z, 1);
                let newPoint = vec4.create();
                vec4.transformMat4(newPoint, point, levelMatrix);

                pos.push(newPoint[0]);
                pos.push(newPoint[1]);
                pos.push(newPoint[2]);

                normal = formVertice.normal;
                normal = vec3.fromValues(normal.x, normal.y, normal.z);
                let newNormal = vec4.create();
                vec3.transformMat3(newNormal, normal, normalMatrix);

                normals.push(newNormal[0]);
                normals.push(newNormal[1]);
                normals.push(newNormal[2]);
            }
        }


        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    
        this.trianglesVerticeBuffer = trianglesVerticeBuffer;

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.trianglesNormalBuffer = trianglesNormalBuffer;
    }

    levelMatrix(vertice) {
        var mat4=glMatrix.mat4;
        var mat3=glMatrix.mat3;
        var vec3=glMatrix.vec3;
        let point = vertice.position;
        let normal = vertice.normal;
        point = vec3.fromValues(point.x,point.y,point.z);
        normal = vec3.fromValues(normal.x,normal.y,normal.z);
        let tangent = vec3.create();
        vec3.cross(tangent, normal, vec3.fromValues(0,0,-1));
        let binormal = vec3.create();
        vec3.cross(binormal, normal, tangent);

        vec3.normalize(normal, normal);
        vec3.normalize(binormal, binormal);
        vec3.normalize(tangent, tangent);

        let levelMatrix = mat4.fromValues(
            normal[0],normal[1],normal[2],0,
            binormal[0],binormal[1],binormal[2],0,
            tangent[0],tangent[1],tangent[2],0,
            point[0],point[1],point[2],1
        );

        let normalMatrix = mat3.fromValues(
            normal[0],normal[1],normal[2],
            binormal[0],binormal[1],binormal[2],
            tangent[0],tangent[1],tangent[2],
        );

        return {levelMatrix: levelMatrix, normalMatrix: normalMatrix};
    }

    draw() {
        let gl = this.gl;
        let glProgram = this.glProgram;
        let trianglesVerticeBuffer = this.trianglesVerticeBuffer;
        let trianglesNormalBuffer = this.trianglesNormalBuffer;

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        super.draw();
    }
}