import { SweepSurface } from '../sweep_surface.js';
import { CurveForm } from '../../form/curve_form.js';
import { Line } from '../../form/line.js';
import { GraphicObject } from '../graphic_object.js';

function createHalfWall(gl, glProgram, height, len, texture) {
  let point1 = [0, -len / 2, 0];
  let point2 = [0, -len / 4, 0];
  let point3 = [0, len / 4, 0];
  let point4 = [0, len / 2, 0];
  const rotated = Math.PI / 2;

  const controlPoints1 = [point1, point2, point3, point4];

  point1 = [0.0 + height, 0 - (height / 4), 0];
  point2 = [0.1 + height, -0.05 - (height / 4), 0];
  point3 = [0.2, 0.05, 0];
  point4 = [0.3, 0, 0];
  const controlPoints2 = [point1, point2, point3, point4];

  point1 = [0.0, 0, 0];
  point2 = [-0.1, 0, 0];
  point3 = [-0.1, -0.1, 0];
  point4 = [0, -0.1, 0];
  const controlPoints3 = [point1, point2, point3, point4];

  const half_wall_curve = new CurveForm(16, controlPoints2);
  half_wall_curve.flipNormals();

  const half_wall = new SweepSurface(controlPoints1, 16, half_wall_curve, gl, glProgram, [0, 0, 0], texture);

  const top_step_curve = new CurveForm(16, controlPoints3);
  const top_step = new SweepSurface(controlPoints1, 16, top_step_curve, gl, glProgram, [0, 0, 0], texture, 1, 1 / 3);
  top_step.rotate(0, Math.PI / 12, 0);
  top_step.translate(height, 0, 0);
  half_wall.addChild(top_step);

  const start = {
    x: 0,
    y: -0.1,
    z: 0,
  };
  const finish = {
    x: 0,
    y: -0.15,
    z: 0,
  };
  const normal = {
    x: -1,
    y: 0,
    z: 0,
  };
  const top_floor = new SweepSurface(controlPoints1, 16, new Line(16, start, finish, normal), gl, glProgram, [0, 0, 0], texture, 1, 1 / 10);

  top_step.addChild(top_floor);
  top_step.scale(0.5, 1, 1);

  half_wall.scale(0.5, 1, 1);
  half_wall.translate(0.15, 0, 0);
  half_wall.rotate(0, 0, -5 * Math.PI / 12);
  half_wall.rotate(-rotated, 0, 0);

  return half_wall;
}

export function createWall(gl, glProgram, height, len, texture) {
  const half_wall1 = createHalfWall(gl, glProgram, height, len, texture);

  const node = new GraphicObject(gl, 0, 0, glProgram);
  node.setAsNode();
  const half_wall2 = createHalfWall(gl, glProgram, height, len, texture);
  node.addChild(half_wall2);
  node.rotate(0, Math.PI, 0);

  const parentNode = new GraphicObject(gl, 0, 0, glProgram);
  parentNode.setAsNode();
  parentNode.addChild(node);
  parentNode.addChild(half_wall1);

  parentNode.rotate(0, Math.PI / 2, 0);

  return parentNode;
}
