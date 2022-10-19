import {castleFloor} from "./castle_floor.js";
import {GraphicObject} from "./graphic_object.js";

export function castleStructure(gl, glProgram, floor_number) {
    let node = new GraphicObject(gl, 0, 0, glProgram);
    node.setAsNode();

    for(let i=0; i < floor_number; i++) {
        let castle_floor = castleFloor(gl, glProgram, 0.7 * i, 8, 8);
        node.addChild(castle_floor);
    }

    return node;
}