import { Form } from "./form.js";

export class WallForm extends Form {
    constructor(form) {
        let vertices = [];

        for (let u=0; u < form.length; u+=1) {
            let vertice = {
                position: {},
                normal: {}
            };
            
            vertice.position.x = form[u][0];
            vertice.position.y = form[u][1];
            vertice.position.z = form[u][2];
            
            vertice.normal.x = 0;
            vertice.normal.y = 0;
            vertice.normal.z = 1;

            vertices.push(vertice);
        }
        super(vertices, form.length);
    }
}