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

    getMaxX() {
        return Math.max(...this.vertices.map(vertice => vertice.x));
    }

    flipNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.x = -vertice.normal.x;
            vertice.normal.y = -vertice.normal.y;
            vertice.normal.z = -vertice.normal.z;
        });
    }
}