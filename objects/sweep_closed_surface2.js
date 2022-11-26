import {curvaCubica, curvaCubicaDerivadaPrimera} from "../curves.js";
import {GraphicObject} from "./graphic_object.js";

export class SweepClosedSurface2 extends GraphicObject {
    constructor(controlPoints, steps, form, gl, glProgram, color, texture, u_factor, v_factor, leadx_factor, leady_factor, angle, offset_x, offset_y) {
        super(gl, steps+5, form.len(), glProgram, color, texture);
        this.controlPoints = controlPoints;
        this.form = form;
        this.steps = steps;
        this.createSurface(u_factor || 1.0, v_factor || 1.0, leadx_factor || u_factor, leady_factor || v_factor, angle || 0, offset_x || 0, offset_y || 0);
    }

    createSurface(u_factor, v_factor, leadx_factor, leady_factor, angle, offset_x, offset_y) {
        let gl = this.gl;
        var vec4=glMatrix.vec4;
        var vec3=glMatrix.vec3;
        let delta = 1/this.steps;
        let form = this.form;
        let fromLen = form.len();
        let formVertice;
        let point;
        let normal;
        let pos = [];
        let normals = [];
        let uv = [];
        const xMin = form.getMinX();
        const xMax = form.getMaxX();
        const yMin = form.getMinY();
        const yMax = form.getMaxY();

        const {levelMatrix, normalMatrix} = this.levelMatrix(0);
        for(let i=0; i < fromLen; i++) {
            point = curvaCubica(0, this.controlPoints);
            point = vec4.fromValues(point.x, point.y, point.z, 1);
            let newPoint = vec4.create();
            vec4.transformMat4(newPoint, point, levelMatrix);

            pos.push(point[0]);
            pos.push(point[1]);
            pos.push(point[2]);

            normal = vec3.fromValues(0, 0, -1);
            let newNormal = vec4.create();
            vec3.transformMat3(newNormal, normal, normalMatrix);

            normals.push(newNormal[0]);
            normals.push(newNormal[1]);
            normals.push(newNormal[2]);

            uv.push((0.5 * leadx_factor) + offset_x);
            uv.push((0.5 * leady_factor) + offset_y);
        }

        for(let i=0; i < fromLen; i++) {
            formVertice = form.vertice(i);
            point = formVertice.position;
            point = vec4.fromValues(point.x, point.y, point.z, 1);
            let newPoint = vec4.create();
            vec4.transformMat4(newPoint, point, levelMatrix);

            pos.push(newPoint[0]);
            pos.push(newPoint[1]);
            pos.push(newPoint[2]);

            normal = vec3.fromValues(0, 0, -1);
            let newNormal = vec4.create();
            vec3.transformMat3(newNormal, normal, normalMatrix);

            normals.push(newNormal[0]);
            normals.push(newNormal[1]);
            normals.push(newNormal[2]);

            if (formVertice.uv) {
                uv.push(formVertice.uv.x);
                uv.push(formVertice.uv.y);
                continue;
            }


            let uv_x = ((point[0]-xMin) * leadx_factor / (xMax - xMin));
            let uv_y = ((point[1]-yMin) * leady_factor / (yMax - yMin));

            uv.push((uv_x * Math.cos(angle)) - (uv_y * Math.sin(angle)) + offset_x);
            uv.push((uv_y * Math.cos(angle)) + (uv_x * Math.sin(angle)) + offset_y);
        }

        for(let u=0; u <= 1.001; u+=delta) {
            const {levelMatrix, normalMatrix} = this.levelMatrix(u);
            for(let i=0; i < fromLen; i++) {
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

                uv.push(u * u_factor);
                uv.push((i/fromLen) * v_factor);
            }
        }

        {
        const {levelMatrix, normalMatrix} = this.levelMatrix(1)
        for(let i=0; i < fromLen; i++) {
            formVertice = form.vertice(i);
            point = formVertice.position;
            point = vec4.fromValues(point.x, point.y, point.z, 1);
            let newPoint = vec4.create();
            vec4.transformMat4(newPoint, point, levelMatrix);

            pos.push(newPoint[0]);
            pos.push(newPoint[1]);
            pos.push(newPoint[2]);

            normal = vec3.fromValues(0, 0, 1);
            let newNormal = vec4.create();
            vec3.transformMat3(newNormal, normal, normalMatrix);

            normals.push(newNormal[0]);
            normals.push(newNormal[1]);
            normals.push(newNormal[2]);

            if (formVertice.uv) {
                uv.push(formVertice.uv.x);
                uv.push(formVertice.uv.y);
                continue;
            }

            let uv_x = ((point[0]-xMin) * leadx_factor / (xMax - xMin));
            let uv_y = ((point[1]-yMin) * leady_factor / (yMax - yMin));

            uv.push((uv_x * Math.cos(angle)) - (uv_y * Math.sin(angle)) + offset_x);
            uv.push((uv_y * Math.cos(angle)) + (uv_x * Math.sin(angle)) + offset_y);
        }

        for(let i=0; i < fromLen; i++) {
            point = curvaCubica(1, this.controlPoints);
            point = vec4.fromValues(point.x, point.y, point.z, 1);
            let newPoint = vec4.create();
            vec4.transformMat4(newPoint, point, levelMatrix);

            pos.push(point[0]);
            pos.push(point[1]);
            pos.push(point[2]);

            normal = vec3.fromValues(0, 0, 1);
            let newNormal = vec4.create();
            vec3.transformMat3(newNormal, normal, normalMatrix);

            normals.push(newNormal[0]);
            normals.push(newNormal[1]);
            normals.push(newNormal[2]);

            uv.push((0.5 * leadx_factor) + offset_x);
            uv.push((0.5 * leady_factor) + offset_y);
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

        let trianglesUvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
        this.trianglesUvBuffer = trianglesUvBuffer;
    }

    levelMatrix(u) {
        var mat4=glMatrix.mat4;
        var mat3=glMatrix.mat3;
        var vec3=glMatrix.vec3;
        let point = curvaCubica(u, this.controlPoints);
        let tangent = curvaCubicaDerivadaPrimera(u, this.controlPoints);
        point = vec3.fromValues(point.x,point.y,point.z);
        tangent = vec3.fromValues(tangent.x,tangent.y,tangent.z);
        let normal = vec3.create();
        vec3.cross(normal, tangent, vec3.fromValues(0,0,1));
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
        let trianglesUvBuffer = this.trianglesUvBuffer;

        let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        let vertexUvAttribute = gl.getAttribLocation(glProgram, "aUv");
        gl.enableVertexAttribArray(vertexUvAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesUvBuffer);
        gl.vertexAttribPointer(vertexUvAttribute, 2, gl.FLOAT, false, 0, 0);

        super.draw();
    }
}