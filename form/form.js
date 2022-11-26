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

    getVertices() {
        return this.vertices;
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

    flipNormal(i) {
            this.vertices[i].normal.x = -this.vertices[i].normal.x;
            this.vertices[i].normal.y = -this.vertices[i].normal.y;
            this.vertices[i].normal.z = -this.vertices[i].normal.z;
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

    swapXYPositions() {
        this.vertices.forEach(vertice => {
            let vetice_ = vertice;
            vertice.position.x = vetice_.position.y;
            vertice.position.y = vetice_.position.x;
            vertice.position.z = vetice_.position.z;
        });
    }
    
    swapXZPositions() {
        this.vertices.forEach(vertice => {
            let vetice_ = vertice;
            vertice.position.x = vetice_.position.z;
            vertice.position.y = vetice_.position.y;
            vertice.position.z = vetice_.position.x;
        });
    }

    swapYZPositions() {
        this.vertices.forEach(vertice => {
            let vetice_ = vertice;
            vertice.position.x = vetice_.position.x;
            vertice.position.y = vetice_.position.z;
            vertice.position.z = vetice_.position.y;
        });
    }

    swapAll1Positions() {
        this.vertices.forEach(vertice => {
            let vetice_ = vertice;
            vertice.position.x = vetice_.position.z;
            vertice.position.y = vetice_.position.x;
            vertice.position.z = vetice_.position.y;
        });
    }

    swapAll2Positions() {
        this.vertices.forEach(vertice => {
            let vetice_ = vertice;
            vertice.position.x = vetice_.position.y;
            vertice.position.y = vetice_.position.z;
            vertice.position.z = vetice_.position.x;
        });
    }

    addVertice(vertice) {
        this.vertices.push(vertice);
        this.length++;
    }

    endInFirst() {
        this.vertices.push(this.vertices[0]);
        this.length++;
    }

    rotatePoints(dis) {
        let second = this.vertices.slice(0, dis);
        let first = this.vertices.slice(dis, this.vertices.length);
        this.vertices = first.concat(second);
    }

    rotateAllX(angle) {
        let vec3=glMatrix.vec3;
        this.vertices = this.vertices.map(vertice => {
           let position=vec3.fromValues(vertice.position.x, vertice.position.y, vertice.position.z);
           let normal=vec3.fromValues(vertice.normal.x, vertice.normal.y, vertice.normal.z);

           vec3.rotateX(position, position, [0,0,0], angle);
           vec3.rotateX(normal, normal, [0,0,0], angle);

            return {
                position: {
                    x: position[0],
                    y: position[1],
                    z: position[2],
                },
                normal: {
                    x: normal[0],
                    y: normal[1],
                    z: normal[2],
                }
            };
        });
    }

    rotateAllY(angle) {
        let vec3=glMatrix.vec3;
        this.vertices = this.vertices.map(vertice => {
           let position=vec3.fromValues(vertice.position.x, vertice.position.y, vertice.position.z);
           let normal=vec3.fromValues(vertice.normal.x, vertice.normal.y, vertice.normal.z);

           vec3.rotateY(position, position, [0,0,0], angle);
           vec3.rotateY(normal, normal, [0,0,0], angle);

            return {
                position: {
                    x: position[0],
                    y: position[1],
                    z: position[2],
                },
                normal: {
                    x: normal[0],
                    y: normal[1],
                    z: normal[2],
                }
            };
        });
    }

    rotateAllZ(angle) {
        let vec3=glMatrix.vec3;
        this.vertices = this.vertices.map(vertice => {
           let position=vec3.fromValues(vertice.position.x, vertice.position.y, vertice.position.z);
           let normal=vec3.fromValues(vertice.normal.x, vertice.normal.y, vertice.normal.z);

           vec3.rotateZ(position, position, [0,0,0], angle);
           vec3.rotateZ(normal, normal, [0,0,0], angle);

            return {
                position: {
                    x: position[0],
                    y: position[1],
                    z: position[2],
                },
                normal: {
                    x: normal[0],
                    y: normal[1],
                    z: normal[2],
                }
            };
        });
    }
}