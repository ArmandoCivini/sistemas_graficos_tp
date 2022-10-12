import {indexBufferBuilder} from "./index_buffer_builder.js";

export class GraphicObject {

    constructor(gl, rows, cols, glProgram) {
        var vec3=glMatrix.vec3;
        this.gl = gl;
        this.glProgram = glProgram;
        var mat4=glMatrix.mat4;
        this.modelMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.buffers = indexBufferBuilder(gl, rows, cols);
        this.childs = [];
        this.rotate_angle = 0;
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = vec3.fromValues(0, 0, 0);
        this._scale = vec3.fromValues(1, 1, 1);
        
    }

    applyTransformations() {
        var mat4=glMatrix.mat4;
        let modelMatrix = this.modelMatrix;
        let normalMatrix = this.normalMatrix;
        let viewMatrix = this.viewMatrix;
        let position = this.position;
        let rotation = this.rotation;
        let _scale = this._scale;

        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, position);
        mat4.rotate(modelMatrix, modelMatrix, rotation[0], [1, 0, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotation[1], [0, 1, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotation[2], [0, 0, 1]);
        mat4.scale(modelMatrix, modelMatrix, _scale);

        mat4.identity(normalMatrix);
        mat4.multiply(normalMatrix,viewMatrix,modelMatrix);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
    }

    updateViewMatrix(viewMatrix) {
        this.viewMatrix = viewMatrix;
    }

    translate(x, y, z) {
        var vec3=glMatrix.vec3;
        this.position = vec3.fromValues(x, y, z);
        this.applyTransformations();
    }
    
    rotate(x, y, z) {
        var vec3=glMatrix.vec3;
        this.rotation = vec3.fromValues(x, y, z);
        this.applyTransformations();
    }

    scale(x, y, z) {
        var vec3=glMatrix.vec3;
        this._scale = vec3.fromValues(x, y, z);
        this.applyTransformations();
    }

    setupVertexShaderMatrix(gl){
        var modelMatrixUniform = gl.getUniformLocation(this.glProgram, "modelMatrix");
        var normalMatrixUniform  = gl.getUniformLocation(this.glProgram, "normalMatrix");

        gl.uniformMatrix4fv(modelMatrixUniform, false, this.modelMatrix);
        gl.uniformMatrix4fv(normalMatrixUniform, false, this.normalMatrix);
    }

    draw() {
        let gl = this.gl;

        this.setupVertexShaderMatrix(gl);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers);
        gl.drawElements(gl.TRIANGLE_STRIP, this.buffers.number_vertex_point, gl.UNSIGNED_SHORT, 0);
    }
}