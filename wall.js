import {SweepSurface} from "./sweep_surface.js";
import {CurveForm} from "./curve_form.js";
import {Line} from "./line.js";
import {GraphicObject} from "./graphic_object.js";

function createHalfWall(gl, glProgram, height, len) {
    let point1 = [0, -len/2, 0];
    let point2 = [0, -len/4, 0];
    let point3 = [0, len/4, 0];
    let point4 = [0, len/2, 0];
    let rotated = Math.PI/2;
    
    let controlPoints1 = [point1, point2, point3, point4];

    point1 = [0.0+height, 0-(height/4), 0];
    point2 = [0.1+height, -0.05-(height/4), 0];
    point3 = [0.2, 0.05, 0];
    point4 = [0.3, 0, 0];
    let controlPoints2 = [point1, point2, point3, point4];

    point1 = [0.0, 0, 0];
    point2 = [-0.1, 0, 0];
    point3 = [-0.1, -0.1, 0];
    point4 = [0, -0.1, 0];
    let controlPoints3 = [point1, point2, point3, point4];

    let half_wall_curve = new CurveForm(16, controlPoints2);
    // half_wall_curve.normalizeNormals();
    // half_wall_curve.flipYNormals();
    half_wall_curve.flipNormals();
    // half_wall_curve.swapXYNormals();

    let half_wall = new SweepSurface(controlPoints1, 16, half_wall_curve, gl, glProgram, [0.49020, 0.49020, 0.49804]);
    
    let top_step_curve = new CurveForm(16, controlPoints3);
    let top_step = new SweepSurface(controlPoints1, 16, top_step_curve, gl, glProgram, [0.49020, 0.49020, 0.49804]);
    top_step.rotate(0,Math.PI/12,0);
    top_step.translate(height, 0, 0);
    half_wall.addChild(top_step);

    let start = {
        x: 0,
        y: -0.1,
        z: 0,
    };
    let finish = {
        x: 0,
        y: -0.15,
        z: 0,
    };
    let normal = {
            x: -1,
            y: 0,
            z: 0,
    };
    let top_floor = new SweepSurface(controlPoints1, 16, new Line(16, start, finish, normal), gl, glProgram, [0.49020, 0.49020, 0.49804]);
    
    top_step.addChild(top_floor);
    top_step.scale(0.5, 1, 1);

    half_wall.scale(0.5, 1, 1);
    half_wall.translate(0.15, 0, 0);
    half_wall.rotate(0, 0, -5 * Math.PI/12);
    half_wall.rotate(-rotated, 0, 0);

    return half_wall;
}

export function createWall(gl, glProgram, height, len) {
    let half_wall1 = createHalfWall(gl, glProgram, height, len);

    let node = new GraphicObject(gl, 0, 0, glProgram);
    node.setAsNode();
    let half_wall2 = createHalfWall(gl, glProgram, height, len);
    node.addChild(half_wall2);
    node.rotate(0, Math.PI, 0);

    let parentNode = new GraphicObject(gl, 0, 0, glProgram);
    parentNode.setAsNode();
    parentNode.addChild(node);
    parentNode.addChild(half_wall1);

    parentNode.rotate(0, Math.PI/2, 0);

    return parentNode;
}