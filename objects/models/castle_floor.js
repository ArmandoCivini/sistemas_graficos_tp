import {SweepClosedSurface} from "../sweep_closed_surface.js";
import {Window} from "../../form/window.js";
import {GraphicObject} from "../graphic_object.js";
import { Rectangle } from "../../form/rectangle.js";

function createWindow(controlPoints, gl, glProgram) {
    let window = new SweepClosedSurface(controlPoints, 2, new Window(32, 0.5), gl, glProgram, [0.00000, 0.05196, 0.00000]);
    window.setKs(1.0);
    window.setGlossiness(10.0);
    return window;
}

export function castleFloor(gl, glProgram, height, x_len, z_len, texture) {
    let window_separation = 0.3;

    let point1 = [0.0, -2, 0.0];
    let point2 = [0.0, 0, 0.0];
    let point3 = [0.0, 1, 0.0];
    let point4 = [0.0, 2, 0.0];

    let controlPoints = [point1, point2, point3, point4];

    let height_node = new GraphicObject(gl, 0, 0, glProgram);
    height_node.setAsNode();

    point1 = [0.0, -0.5, 0.0];
    point2 = [0.0, -0.3, 0.0];
    point3 = [0.0, -0.1, 0.0];
    point4 = [0.0, 0.1, 0.0];

    let controlPoints2 = [point1, point2, point3, point4];

    let castle_structure = new SweepClosedSurface(controlPoints2, 8, new Rectangle(0.5, 0.5), gl, glProgram, [0,0,0], texture, 8, 16);
    castle_structure.scale(x_len/2, 1, z_len/4);

    let back_center = castle_structure.transformPoint(0, -0.2, -0.25);
    let front_center = castle_structure.transformPoint(0, -0.2, 0.25);

    let right_side = castle_structure.transformPoint(0.25, -0.2, 0.0);
    let left_side = castle_structure.transformPoint(-0.25, -0.2, 0.0);

    let floor_len_z = front_center[2] - back_center[2];
    let floor_len_x = right_side[0] - left_side[0];

    for(let i=window_separation; i < floor_len_x; i+=window_separation) {
        let window = createWindow(controlPoints, gl, glProgram);
        window.translate(left_side[0]+i,left_side[1],front_center[2]);
        window.scale(0.2,0.2,1);
        window.scale(1,1,0.005);
        window.rotate(-Math.PI/2, 0, 0);

        height_node.addChild(window);
    }

    for(let i=window_separation; i < floor_len_x; i+=window_separation) {
        let window = createWindow(controlPoints, gl, glProgram);
        window.translate(left_side[0]+i,left_side[1],back_center[2]);
        window.scale(0.2,0.2,1);
        window.scale(1,1,0.005);
        window.rotate(-Math.PI/2, 0, 0);

        height_node.addChild(window);
    }

    for(let i=window_separation; i < floor_len_z-window_separation; i+=window_separation) {
        let window = createWindow(controlPoints, gl, glProgram);
        window.translate(left_side[0],left_side[1],back_center[2]+i+0.1);
        window.rotate(0, Math.PI/2, 0);
        window.scale(0.2,0.2,1);
        window.scale(1,1,0.005);
        window.rotate(-Math.PI/2, 0, 0);

        height_node.addChild(window);
    }

    for(let i=window_separation; i < floor_len_z-window_separation; i+=window_separation) {
        let window = createWindow(controlPoints, gl, glProgram);
        window.translate(right_side[0],left_side[1],back_center[2]+i+0.1);
        window.rotate(0, Math.PI/2, 0);
        window.scale(0.2,0.2,1);
        window.scale(1,1,0.005);
        window.rotate(-Math.PI/2, 0, 0);

        height_node.addChild(window);
    }

    height_node.addChild(castle_structure);
    height_node.translate(0, height, 0);

    let back_left_corner = {
        x:left_side[0],
        y:0,
        z: back_center[2],
    };
    
    let back_right_corner = {
        x:right_side[0],
        y:0,
        z: back_center[2],
    };

    let front_left_corner = {
        x:left_side[0],
        y:0,
        z: front_center[2],
    };

    let front_right_corner = {
        x:right_side[0],
        y:0,
        z: front_center[2],
    };

    let corners = [back_left_corner, back_right_corner, front_left_corner, front_right_corner];

    return {
        castle_floor: height_node,
        corners: corners
    };
}