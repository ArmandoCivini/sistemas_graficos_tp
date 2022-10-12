import {GraphicObject} from "./graphic_object.js";

export class TestObject extends GraphicObject {
    constructor(gl, rows, cols, glProgram) {
        super(gl, rows, cols, glProgram);
        let pos = [];
        var normal=[];
        for (var i=0;i<rows;i++){
            for (var j=0;j<cols;j++){

                var alfa=j/(cols-1)*Math.PI*2;
                var beta=(0.1+i/(rows-1)*0.8)*Math.PI;

                var p = this.getPos(alfa,beta);

                pos.push(p[0]);
                pos.push(p[1]);
                pos.push(p[2]);

                var n = this.getNrm(alfa,beta);

                normal.push(n[0]);
                normal.push(n[1]);
                normal.push(n[2]);
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

    
    getPos(alfa,beta){

        var r=2;
        var nx=Math.sin(beta)*Math.sin(alfa);
        var ny=Math.sin(beta)*Math.cos(alfa);
        var nz=Math.cos(beta);


        var g=beta%0.5;
        var h=alfa%1;
        var f=1;

        if (g<0.25) f=0.95;
        if (h<0.5) f=f*0.95;
        
        var x=nx*r*f;
        var y=ny*r*f;
        var z=nz*r*f;

        return [x,y,z];
    }

    getNrm(alfa,beta){
        var vec3=glMatrix.vec3;
        var p = this.getPos(alfa,beta);
        var v=vec3.create();
        vec3.normalize(v,p);

        var delta=0.05;
        var p1 = this.getPos(alfa,beta);
        var p2 = this.getPos(alfa,beta+delta);
        var p3 = this.getPos(alfa+delta,beta);

        var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
        var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);

        vec3.normalize(v1,v1);
        vec3.normalize(v2,v2);
        
        var n=vec3.create();
        vec3.cross(n,v1,v2);
        vec3.scale(n,n,-1);
        return n;
    }
}