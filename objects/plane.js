import {GraphicObject} from "./graphic_object.js";

export class Plane extends GraphicObject {
    constructor(gl, rows, cols, glProgram, color) {
        super(gl, rows, cols, glProgram, color);
        let pos = [];
        var normal=[];
        for (var i=0;i<rows;i++){
            for (var j=0;j<cols;j++){

                pos.push((i/rows*2)-1);
                pos.push(0);
                pos.push((j/cols*2)-1);

                normal.push(0);
                normal.push(1);
                normal.push(0);
            }

        }

        let trianglesVerticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    
        this.trianglesVerticeBuffer = trianglesVerticeBuffer;

        let trianglesNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
        this.trianglesNormalBuffer = trianglesNormalBuffer;
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