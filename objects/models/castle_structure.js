import { castleFloor } from './castle_floor.js';
import { GraphicObject } from '../graphic_object.js';
import { RevSurface } from '../rev_surface.js';
import { CurveForm } from '../../form/curve_form.js';
import { Line } from '../../form/line.js';

function createTower(gl, glProgram, x_pos, z_pos, len, texture) {
  const point1 = [0.3, 0, 0];
  const point2 = [0.3, 0.2, 0];
  const point3 = [0.2, 0.1, 0];
  const point4 = [0.2, 0.3, 0];

  const controlPoints = [point1, point2, point3, point4];

  let start = {
    x: 0.3,
    y: -0.5,
    z: 0,
  };
  let finish = {
    x: 0.3,
    y: 0,
    z: 0,
  };
  let normal = {
    x: 1,
    y: 0,
    z: 0,
  };
  const tower = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0, 0, 0], texture, 4, 2);
  const tower_curve = new RevSurface(32, new CurveForm(128, controlPoints), gl, glProgram, [0, 0, 0], texture, 4, 2);

  start = {
    x: 0.2,
    y: 0,
    z: 0,
  };
  finish = {
    x: 0.2,
    y: len,
    z: 0,
  };
  normal = {
    x: 1,
    y: 0,
    z: 0,
  };
  const tower_bottom = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0, 0, 0], texture, 4, 8);

  start = {
    x: 0,
    y: 0.5,
    z: 0,
  };
  finish = {
    x: 0.4,
    y: 0,
    z: 0,
  };
  normal = {
    x: 0.78,
    y: 0.63,
    z: 0,
  };
  const tower_ceiling = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.00000, 0.16863, 0.50196]);

  start = {
    x: 0,
    y: 0,
    z: 0,
  };
  finish = {
    x: 0.4,
    y: 0,
    z: 0,
  };
  normal = {
    x: 0,
    y: 1,
    z: 0,
  };
  const tower_ceiling_closed = new RevSurface(32, new Line(4, start, finish, normal), gl, glProgram, [0.00000, 0.16863, 0.50196]);
  tower_ceiling.addChild(tower_ceiling_closed);
  tower_ceiling.translate(0, 0, -0.5);
  tower_ceiling.scale(1, 1, -1);

  tower.addChild(tower_curve);
  tower.addChild(tower_bottom);
  tower.addChild(tower_ceiling);
  tower.translate(x_pos * 1.1, 0, z_pos * 1.1);
  tower.rotate(Math.PI / 2, 0, 0);
  return tower;
}

function addTower(gl, glProgram, corner, castle_floor, len, texture) {
  castle_floor.addChild(createTower(gl, glProgram, corner.x, corner.z, len, texture));
}

export function castleStructure(gl, glProgram, floor_number, x_len, y_len, texture) {
  const node = new GraphicObject(gl, 0, 0, glProgram);
  node.setAsNode();

  const {
    castle_floor,
    corners,
  } = castleFloor(gl, glProgram, (floor_number - 1) * 0.6, x_len, y_len, texture);

  corners.forEach((corner) => {
    addTower(gl, glProgram, corner, castle_floor, (floor_number - 1) * 0.6 + 0.5, texture);
  });

  node.addChild(castle_floor);

  for (let i = 0; i < floor_number - 1; i++) {
    const { castle_floor } = castleFloor(gl, glProgram, 0.6 * i, x_len, y_len, texture);
    node.addChild(castle_floor);
  }
  node.translate(0, 0, -0.15);
  return node;
}
