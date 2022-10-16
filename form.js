export class Form {
    constructor(vertices, length) {
        this.vertices = vertices;
        this.length = length;
    }

    len() {
        return this.length;
    }

    vertice(i) {
        return this.vertices[i];
    }

    transpose(x, y, z) {
        let vertice;
        for(let i=0; i < this.length; i++) {
            vertice = this.vertices[i];
            vertice.x += x;
            vertice.y += y;
            vertice.z += z;
            this.vertices[i] = vertice;
        }
    }
}