import { Form } from "./form.js";

export class Circle extends Form {
    constructor(length, radius) {
        let vertices = [];
        let delta = 1 / length;

        for (let i = 0; i <= 1.001; i+=delta) {
            let vertice = {
                position: {},
                normal: {}
            };
            let x = Math.cos(2 * Math.PI * i);
            let y = Math.sin(2 * Math.PI * i);

            vertice.position.x = radius * x;
            vertice.position.y = radius * y;
            vertice.position.z = 0;

            vertice.normal.x = x;
            vertice.normal.y = y;
            vertice.normal.z = 0;

            vertices.push(vertice);
        }
        
        super(vertices, length+1);
    }
}