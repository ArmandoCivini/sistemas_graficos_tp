import { Form } from "./form.js";
import {curvaCubica, curvaCubicaDerivadaPrimera} from "../curves.js";

export class CurveForm extends Form {
    constructor(steps, controlPoints) {
        let vertices = [];
        let delta = 1/steps;
        var vec3=glMatrix.vec3;

        for (let u=0; u <= 1.001; u+=delta) {
            let vertice = {
                position: {},
                normal: {}
            };
            
            let point = curvaCubica(u, controlPoints);

            vertice.position.x = point.x;
            vertice.position.y = point.y;
            vertice.position.z = point.z;

            let tangent = curvaCubicaDerivadaPrimera(u, controlPoints);
            point = vec3.fromValues(point.x,point.y,point.z);
            tangent = vec3.fromValues(tangent.x,tangent.y,tangent.z);
            let normal = vec3.create();
            vec3.cross(normal, tangent, vec3.fromValues(0,0,1));
            vec3.normalize(normal, normal);
            
            vertice.normal.x = normal[0];
            vertice.normal.y = normal[1];
            vertice.normal.z = normal[2];

            vertices.push(vertice);
        }
        
        super(vertices, steps+1);
    }
}