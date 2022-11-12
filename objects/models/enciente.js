import {Circle} from "../../form/circle.js";
import {createWall} from "./wall.js";
import {createTower} from "./tower.js";
import {GraphicObject} from "../graphic_object.js";
import {SweepClosedSurface} from "../sweep_closed_surface.js";

function wallLen(coordinates_start, coordinates_end) {
    let x1 = coordinates_start.position.x;
    let y1 = coordinates_start.position.y;

    let x2 = coordinates_end.position.x;
    let y2 = coordinates_end.position.y;

    let dif_x = x2 - x1;
    let dif_y = y2 - y1;

    return {
        len: Math.sqrt((dif_x**2) + (dif_y**2)),
        dif_x: dif_x,
        dif_y: dif_y,
    };
}

export function createEnciente(gl, glProgram, height, sides) {
    let circle = new Circle(sides, 2);
    let circleLen = circle.len();

    let height_tower = (0.08 * height) - 0.3;
    let height_wall = (-0.06 * height) + 0.1;
    let height_door = 0.06 * height + 0.2;

    let grandPaNode = new GraphicObject(gl, 0, 0, glProgram);
    grandPaNode.setAsNode();

    let parentNode = new GraphicObject(gl, 0, 0, glProgram);
    parentNode.setAsNode();

    for(let i=0; i < circleLen; i++) {
        let tower = createTower(gl, glProgram, height_tower);
        let coordinates = circle.vertice(i);
        tower.translate(coordinates.position.x, coordinates.position.y, 0);
        parentNode.addChild(tower);
    } 

    let parentNode_walls = new GraphicObject(gl, 0, 0, glProgram);
    parentNode_walls.setAsNode();

    for(let i=1; i < circleLen-1; i++) {
        let coordinates_start = circle.vertice(i);
        let coordinates_end = circle.vertice(i+1);
        let {len, dif_x, dif_y} = wallLen(coordinates_start, coordinates_end); 
        let wall = createWall(gl, glProgram, height_wall, len);
        wall.translate((dif_x/2) + coordinates_start.position.x, -0.21, (dif_y/2)+ coordinates_start.position.y);
        wall.rotate(0, -(Math.PI/(circleLen-1))-((Math.PI * 2 * i)/(1 * (circleLen-1))), 0);
        parentNode_walls.addChild(wall);
    }

    let coordinates_start = circle.vertice(0);
    let coordinates_end = circle.vertice(1);

    let {len, dif_x, dif_y} = wallLen(coordinates_start, coordinates_end); 
    let front_wall_right = createWall(gl, glProgram, height_wall, len/3);
    front_wall_right.translate((dif_x/6) + coordinates_start.position.x, -0.21, (dif_y/6)+ coordinates_start.position.y);
    front_wall_right.rotate(0, -(Math.PI/(circleLen-1))-((Math.PI * 2 * 0)/(1 * (circleLen-1))), 0);
    parentNode_walls.addChild(front_wall_right);

    let front_wall_right_left = createWall(gl, glProgram, height_wall, len/3);
    front_wall_right_left.translate(-(dif_x/6) + coordinates_end.position.x, -0.21, -(dif_y/6)+ coordinates_end.position.y);
    front_wall_right_left.rotate(0, -(Math.PI/(circleLen-1))-((Math.PI * 2 * 0)/(1 * (circleLen-1))), 0);
    parentNode_walls.addChild(front_wall_right_left);


    parentNode_walls.rotate(0, (Math.PI/(circleLen-1)) + Math.PI, 0);

    parentNode.rotate(0, (Math.PI)/(sides)-Math.PI/2, 0);
    parentNode.translate(0, -0.6, 0);

    grandPaNode.addChild(parentNode);
    grandPaNode.addChild(parentNode_walls);

    let door_node = new GraphicObject(gl, 0, 0, glProgram);
    door_node.setAsNode();

    let point1 = [0.0, 0, 0.0];
    let point2 = [0.0, height_door/3, 0.0];
    let point3 = [0.0, (2 * height_door/3), 0.0];
    let point4 = [0.0, height_door, 0.0];

    let controlPoints = [point1, point2, point3, point4];
    let door = new SweepClosedSurface(controlPoints, 4, new Circle(4, len/(3 * Math.sqrt(2))), gl, glProgram, [0.60000, 0.40000, 0.00000]);

    door_node.rotate(0,-Math.PI/2,0);
    door_node.translate(coordinates_start.position.x, 0, coordinates_start.position.y);
    door_node.translate(-len/(3 * Math.sqrt(2))+0.15,0,0);
    door_node.translate(0, -0.5, 0);

    door.scale(0.1, -1, 1);
    door.rotate(0,Math.PI/4,0);

    door_node.rotate(0,0,Math.PI);
    door_node.addChild(door);
    door_node.setDefaultModelMatrix();

    return {
        grandPaNode:grandPaNode,
        door_node:door_node,
    }
}