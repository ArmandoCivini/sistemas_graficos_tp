import {RevSurface} from "./rev_surface.js";
import {Line} from "./line.js";

export function createTerrain(gl, glProgram) {
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
    let rev_surface = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram);

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
    let rev_surface2 = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram);

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
    let rev_surface3 = new RevSurface(8, new Line(4, start, finish, normal), gl, glProgram);

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
    let rev_surface4 = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram);

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
    let rev_surface5 = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram);

    rev_surface.addChild(rev_surface2);
    rev_surface.addChild(rev_surface3);
    rev_surface.addChild(rev_surface4);
    rev_surface.addChild(rev_surface5);
    rev_surface.rotate(-Math.PI/2, 0, 0);
    return rev_surface;
}