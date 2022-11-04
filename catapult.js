import { Rectangle } from "./rectangle.js";
import {SweepClosedSurface} from "./sweep_closed_surface.js";

export function createCatapult(gl, glProgram) {
    let floor_len = 0.5;
    let point1 = [0.0, 0, 0.0];
    let point2 = [0.0, floor_len/3, 0.0];
    let point3 = [0.0, (2 * floor_len/3), 0.0];
    let point4 = [0.0, floor_len, 0.0];

    let controlPoints = [point1, point2, point3, point4];
    let floor = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.5, 0.05), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    // floor.translate(5, -0.4, 5);  
    // floor.rotate(-Math.PI/2, 0, Math.PI/4);

    let frame = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.5, 0.05), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    
    return floor;
}