import {indexBufferBuilder} from "./index_buffer_builder.js";

export class GraphicObject {

    constructor(gl, rows, cols, glProgram, color, texture) {
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
        this.defaultModelMatrix = mat4.create();
        this.Ka = 0.3;
        this.Kd = 0.4;
        this.Ks = 0.05;
        this.glossiness = 120;
        this.ambientColor = color;
        this.diffuseColor = [0.8, 0.55, 0.15];
        this.specularColor = [1.0, 1.0, 1.0];
        this.texture = texture || blackTexture;
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

    setupFragmentWireframe(gl, glProgram) {

        const specularUniform = gl.getUniformLocation(glProgram, "specularColor");           
        gl.uniform3fv(specularUniform, this.specularColor);

        const KaUniform = gl.getUniformLocation(glProgram, "Ka");           
        gl.uniform1f(KaUniform, 1);

        const KdUniform = gl.getUniformLocation(glProgram, "Kd");           
        gl.uniform1f(KdUniform, 0);

        const KsUniform = gl.getUniformLocation(glProgram, "Ks");           
        gl.uniform1f(KsUniform, 0);

        const GlossinessUniform = gl.getUniformLocation(glProgram, "glossiness");           
        gl.uniform1f(GlossinessUniform, 1000);
    }

    setupFragmentUniforms(gl, glProgram) {

        const specularUniform = gl.getUniformLocation(glProgram, "specularColor");           
        gl.uniform3fv(specularUniform, this.specularColor);

        const KaUniform = gl.getUniformLocation(glProgram, "Ka");           
        gl.uniform1f(KaUniform, this.Ka);

        const KdUniform = gl.getUniformLocation(glProgram, "Kd");           
        gl.uniform1f(KdUniform, this.Kd);

        const KsUniform = gl.getUniformLocation(glProgram, "Ks");           
        gl.uniform1f(KsUniform, this.Ks);

        const GlossinessUniform = gl.getUniformLocation(glProgram, "glossiness");           
        gl.uniform1f(GlossinessUniform, this.glossiness);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(glProgram.samplerUniform, 0);
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

            this.setupFragmentUniforms(gl, this.glProgram);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers);
            gl.drawElements(gl.TRIANGLE_STRIP, this.buffers.number_vertex_point, gl.UNSIGNED_SHORT, 0);

            if (colorMode == "wireframe") {
                this.setupFragmentWireframe(gl, this.glProgram);
                gl.drawElements(gl.LINE_STRIP, this.buffers.number_vertex_point, gl.UNSIGNED_SHORT, 0);
            }
        }

        for(let i=0; i < this.childs.length; i++) {
            this.childs[i].setParentMatrix(modelMatrix);
            this.childs[i].draw();
        }
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

    setDefaultModelMatrix() {
        var mat4=glMatrix.mat4;
        this.defaultModelMatrix = mat4.clone(this.modelMatrix);
    }

    resetModelMatrix() {
        var mat4=glMatrix.mat4;
        this.modelMatrix = mat4.clone(this.defaultModelMatrix);
    }

    setGlossiness(glossiness) {
        this.glossiness = glossiness;
    }

    setKa(ka) {
        this.Ka = ka;
    }

    setKd(kd) {
        this.Kd = kd;
    }

    setKs(ks) {
        this.Ks = ks;
    }
}