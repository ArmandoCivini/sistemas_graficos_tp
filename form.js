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
}