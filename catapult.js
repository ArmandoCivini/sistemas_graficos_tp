import { Rectangle } from "./rectangle.js";
import { Circle } from "./circle.js";
import {SweepClosedSurface} from "./sweep_closed_surface.js";
import {GraphicObject} from "./graphic_object.js";

function createWheel(gl, glProgram, controlPoints) {
    let parent_node = new GraphicObject(gl, 0, 0, glProgram);
    parent_node.setAsNode();

    let wheel = new SweepClosedSurface(controlPoints, 4, new Circle(16, 0.1), gl, glProgram, [0.45098, 0.45098, 0.45098]);
    wheel.rotate(0, 0, Math.PI/2);
    wheel.scale(1, 0.07, 1);
    parent_node.addChild(wheel);

    return parent_node;
}

export function createCatapult(gl, glProgram) {
    let floor_len = 0.8;
    let ball_dist = 4.95;
    let point1 = [0.0, -floor_len/2, 0.0];
    let point2 = [0.0, -floor_len/4, 0.0];
    let point3 = [0.0, floor_len/4, 0.0];
    let point4 = [0.0, floor_len/2, 0.0];

    let parent_node = new GraphicObject(gl, 0, 0, glProgram);
    parent_node.setAsNode();
    parent_node.translate(ball_dist, -0.4, ball_dist);
    parent_node.rotate(-Math.PI/2, 0, Math.PI/4);

    let controlPoints = [point1, point2, point3, point4];
    let floor = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.5, 0.05), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    floor.translate(0,-0.48,0);
    parent_node.addChild(floor);

    let frame = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.1, 0.1), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    frame.translate(0, 0, 0.2);
    frame.rotate(Math.PI/2, 0, 0);
    frame.scale(1, 0.5, 1);
    floor.addChild(frame);

    let rotation_node = new GraphicObject(gl, 0, 0, glProgram);
    rotation_node.setAsNode();
    rotation_node.translate(0, 0, 0.4);
    floor.addChild(rotation_node);

    let arm = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.1, 0.1), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    arm.scale(1, 1.2, 0.5);
    rotation_node.addChild(arm);

    let bucket = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.3, 0.1), gl, glProgram, [0.60000, 0.40000, 0.00000]);
    bucket.translate(0, 0.55, 0);
    bucket.scale(1, 0.3, 0.5);
    rotation_node.addChild(bucket);

    let counter_weight = new SweepClosedSurface(controlPoints, 4, new Rectangle(0.3, 0.3), gl, glProgram, [0.45098, 0.45098, 0.45098]);
    counter_weight.translate(0, -0.55, -0.05);
    counter_weight.scale(1, 0.3, 0.5);
    rotation_node.addChild(counter_weight);

    rotation_node.rotate(-Math.PI/5, 0, 0);

    let wheel1 = createWheel(gl, glProgram, controlPoints);
    wheel1.translate(0.28,0.27,0);
    floor.addChild(wheel1);

    let wheel2 = createWheel(gl, glProgram, controlPoints);
    wheel2.translate(-0.28,0.27,0);
    floor.addChild(wheel2);

    let wheel3 = createWheel(gl, glProgram, controlPoints);
    wheel3.translate(0.28,-0.27,0);
    floor.addChild(wheel3);

    let wheel4 = createWheel(gl, glProgram, controlPoints);
    wheel4.translate(-0.28,-0.27,0);
    floor.addChild(wheel4);

    return {
        floor:parent_node, 
        rotation_node:rotation_node
    };
}