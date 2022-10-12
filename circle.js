import { Form } from "./form.js";

export class Circle extends Form {
    constructor(length, radius) {
        let vertices = [];
        let delta = 1 / length;
        let mod;

        for (let i = 0; i <= 1.001; i+=delta) {
            let vertice = {
                position: {},
                normal: {}
            };
            vertice.position.x = radius * Math.cos(2 * Math.PI * i);
            vertice.position.z = 0;
            vertice.position.y = radius * Math.sin(2 * Math.PI * i);

            mod = Math.sqrt((vertice.position.x ** 2) + (vertice.position.y ** 2));

            vertice.normal.x = vertice.position.x / mod;
            vertice.normal.z = 0;
            vertice.normal.y = vertice.position.y / mod;

            vertices.push(vertice);
        }
        
        super(vertices, length+1);
    }
}