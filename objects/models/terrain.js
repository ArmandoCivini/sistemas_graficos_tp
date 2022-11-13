import {RevSurface} from "../rev_surface.js";
import {Line} from "../../form/line.js";

export function createTerrain(gl, glProgram, texture) {
    let start = {
        x: 3,
        y: 0,
        z: 0,
    };
    let finish = {
        x: 10,
        y: 0,
        z: 0,
    };
    let normal = {
            x: 0,
            y: 1,
            z: 0,
    }
    let ground = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram, [0.09804, 0.30196, 0.09804], texture, 40, 16);

    start = {
        x: 3,
        y: -0.5,
        z: 0,
    };
    finish = {
        x: 3,
        y: 0,
        z: 0,
    };
    normal = {
            x: 1,
            y: 0,
            z: 0,
    }
    let outer_wall = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram, [0.09804, 0.30196, 0.09804], texture, 40, 8);

    start = {
        x: 2,
        y: -0.5,
        z: 0,
    };
    finish = {
        x: 3,
        y: -0.5,
        z: 0,
    };
    normal = {
            x: 0,
            y: 1,
            z: 0,
    }
    let depth_floor = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram);

    start = {
        x: 1.7,
        y: 0,
        z: 0,
    };
    finish = {
        x: 2.1,
        y: -0.5,
        z: 0,
    };
    normal = {
            x: Math.cos(Math.PI/4),
            y: Math.sin(Math.PI/4),
            z: 0,
    }
    let inner_wall = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.09804, 0.30196, 0.09804], texture, 32, 8);

    start = {
        x: 0,
        y: 0,
        z: 0,
    };
    finish = {
        x: 1.7,
        y: 0,
        z: 0,
    };
    normal = {
            x: 0,
            y: 1,
            z: 0,
    }
    let castle_ground = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.09804, 0.30196, 0.09804], texture, 32, 8);
    
    start = {
        x: 0.5,
        y: 0,
        z: 0,
    };
    finish = {
        x: 0.5,
        y: 1.5,
        z: 0,
    };
    normal = {
            x: 1,
            y: 0,
            z: 0,
    }
    let bridge = new RevSurface(4, new Line(4, start, finish, normal), gl, glProgram, [0.09804, 0.30196, 0.09804], texture, 16, 8);
    bridge.rotate(0, 0, -Math.PI/8);
    bridge.translate(1.5, 0, -0.35);
    bridge.rotate(0, Math.PI/2, Math.PI/4);

    ground.addChild(outer_wall);
    ground.addChild(depth_floor);
    ground.addChild(inner_wall);
    ground.addChild(castle_ground);
    ground.addChild(bridge);
    ground.rotate(0, 9 * -Math.PI/24, 0);
    ground.translate(0, -0.5, 0);
    ground.rotate(-Math.PI/2, 0, 0);
    ground.scale(1.5,1.5,1.5);

    return ground;
}