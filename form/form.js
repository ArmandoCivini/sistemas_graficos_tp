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
        return Math.max(...this.vertices.map(vertice => vertice.position.x));
    }

    getMinX() {
        return Math.min(...this.vertices.map(vertice => vertice.position.x));
    }

    getMaxY() {
        return Math.max(...this.vertices.map(vertice => vertice.position.y));
    }

    getMinY() {
        return Math.min(...this.vertices.map(vertice => vertice.position.y));
    }

    flipNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.x = -vertice.normal.x;
            vertice.normal.y = -vertice.normal.y;
            vertice.normal.z = -vertice.normal.z;
        });
    }

    flipXNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.x = -vertice.normal.x;
        });
    }

    flipYNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.y = -vertice.normal.y;
        });
    }

    flipZNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.z = -vertice.normal.z;
        });
    }

    normalizeNormals() {
        this.vertices.forEach(vertice => {
            let mod = Math.sqrt((vertice.normal.x**2)+(vertice.normal.y**2)+(vertice.normal.z**2));
            vertice.normal.x = vertice.normal.x/mod;
            vertice.normal.y = vertice.normal.y/mod;
            vertice.normal.z = vertice.normal.z/mod;
        });
    }

    swapXYNormals() {
        this.vertices.forEach(vertice => {
            vertice.normal.x = vertice.normal.y;
            vertice.normal.y = vertice.normal.x;
            vertice.normal.z = vertice.normal.z;
        });
    }
    
}