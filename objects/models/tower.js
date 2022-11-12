import {CurveForm} from "../../form/curve_form.js";
import {Line} from "../../form/line.js";
import {RevSurface} from "../rev_surface.js";

export function createTower(gl, glProgram, height) {
    let strech = 0.2;
    let point1 = [0.3, 0.1, 0];
    let point2 = [0.3, 0.4, 0];
    let point3 = [0.1, 0.4+height, 0];
    let point4 = [0.2, 0.6+height, 0];
    let rotated = Math.PI/2;
    
    let controlPoints = [point1, point2, point3, point4];

    let tower = new RevSurface(32, new CurveForm(12, controlPoints), gl, glProgram, [0.49020, 0.49020, 0.49804]);

    let start = {
        x: 0.2,
        y: 0.6+height,
        z: 0,
    };
    let finish = {
        x: 0.2,
        y: 0.7+height,
        z: 0,
    };
    let normal = {
            x: 1,
            y: 0,
            z: 0,
    };
    let top_wall_outer = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.49020, 0.49020, 0.49804]);
    tower.addChild(top_wall_outer);


    start = {
        x: 0.2,
        y: 0.7+height,
        z: 0,
    };
    finish = {
        x: 0.15 ,
        y: 0.7+height,
        z: 0,
    };
    normal = {
            x: 0,
            y: 1,
            z: 0,
    };
    let top_ceiling = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.49020, 0.49020, 0.49804]);
    tower.addChild(top_ceiling);

    start = {
        x: 0.15,
        y: 0.7+height,
        z: 0,
    };
    finish = {
        x: 0.15 ,
        y: 0.65+height,
        z: 0,
    };
    normal = {
            x: -1,
            y: 0,
            z: 0,
    };
    let top_wall_inner = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.49020, 0.49020, 0.49804]);
    tower.addChild(top_wall_inner);

    start = {
        x: 0.15,
        y: 0.65+height,
        z: 0,
    };
    finish = {
        x: 0,
        y: 0.65+height,
        z: 0,
    };
    normal = {
            x: 0,
            y: 1,
            z: 0,
    };
    let top_floor = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.49020, 0.49020, 0.49804]);
    tower.addChild(top_floor);

    tower.rotate(-rotated, 0, 0);

    return tower;
}