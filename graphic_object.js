import {indexBufferBuilder} from "./index_buffer_builder.js";

export class GraphicObject {

    constructor(gl, rows, cols, glProgram, color) {
        var vec3=glMatrix.vec3;
        this.gl = gl;
        this.glProgram = glProgram;
        var mat4=glMatrix.mat4;
        this.modelMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.parentMatrix = null;
        this.buffers = indexBufferBuilder(gl, rows, cols);
        this.childs = [];
        this.isChild = false;
        this.rotate_angle = 0;
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = vec3.fromValues(0, 0, 0);
        this._scale = vec3.fromValues(1, 1, 1);
        this.color = color;
        this.isNode = false;
    }

    addChild(child) {
        if (!child) return;
        this.childs.push(child);
    }

    setParentMatrix(parentMatrix) {
        this.parentMatrix = parentMatrix;
    }

    applyNormalMatrix(normalMatrix, modelMatrix) {
        var mat4=glMatrix.mat4;
        mat4.identity(normalMatrix);
        mat4.multiply(normalMatrix,this.viewMatrix,modelMatrix);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
    }

    translate(x, y, z) {
        var mat4=glMatrix.mat4;
        var vec3=glMatrix.vec3;
        let modelMatrix = this.modelMatrix;
        let position = vec3.fromValues(x, y, z);
        mat4.translate(modelMatrix, modelMatrix, position);
    }
    
    rotate(x, y, z) {
        var mat4=glMatrix.mat4;
        var vec3=glMatrix.vec3;
        let modelMatrix = this.modelMatrix;

        let rotation = vec3.fromValues(x, y, z);
        mat4.rotate(modelMatrix, modelMatrix, rotation[0], [1, 0, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotation[1], [0, 1, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotation[2], [0, 0, 1]);
    }

    scale(x, y, z) {
        var mat4=glMatrix.mat4;
        var vec3=glMatrix.vec3;
        let modelMatrix = this.modelMatrix;

        let _scale = vec3.fromValues(x, y, z);
        mat4.scale(modelMatrix, modelMatrix, _scale);
    }

    setupVertexShaderMatrix(gl, modelMatrix, normalMatrix){
        var modelMatrixUniform = gl.getUniformLocation(this.glProgram, "modelMatrix");
        var normalMatrixUniform  = gl.getUniformLocation(this.glProgram, "normalMatrix");

        gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
        gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
    }

    draw() {
        let gl = this.gl;
        var mat4=glMatrix.mat4;
        var modelMatrix = this.modelMatrix;
        var normalMatrix = this.normalMatrix;

        if(this.parentMatrix) {
            modelMatrix = mat4.create();
            mat4.multiply(modelMatrix, this.parentMatrix, this.modelMatrix);
        }

        this.applyNormalMatrix(normalMatrix, modelMatrix);

        if (!this.isNode) {
            this.setupVertexShaderMatrix(gl, modelMatrix, normalMatrix);

            this.drawColor(this.color);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers);
            gl.drawElements(gl.TRIANGLE_STRIP, this.buffers.number_vertex_point, gl.UNSIGNED_SHORT, 0);

            if (colorMode == "wireframe") {
                this.drawColor([0.2, 0.2, 0.2]);
                gl.drawElements(gl.LINE_STRIP, this.buffers.number_vertex_point, gl.UNSIGNED_SHORT, 0);
            }
        }

        for(let i=0; i < this.childs.length; i++) {
            this.childs[i].setParentMatrix(modelMatrix);
            this.childs[i].draw();
        }
    }

    drawColor(color) {
        const modelColor = color ?? [0.215, 0.415, 0.439];
        const colorUniform = this.gl.getUniformLocation(this.glProgram, "surfaceColor");           
        this.gl.uniform3fv(colorUniform, modelColor);
    }

    setAsNode() {
        this.isNode = true;
    }

    transformPoint(x, y, z) {
        var mat4=glMatrix.mat4;
        var vec4=glMatrix.vec4;
        var vec3=glMatrix.vec3;
        var modelMatrix = this.modelMatrix;

        if(this.parentMatrix) {
            modelMatrix = mat4.create();
            mat4.multiply(modelMatrix, this.parentMatrix, this.modelMatrix);
        }
        const newPoint = vec4.fromValues(x, y, z, 1);
        vec4.transformMat4(newPoint, newPoint, modelMatrix);
        return vec3.fromValues(...newPoint);
    }
}