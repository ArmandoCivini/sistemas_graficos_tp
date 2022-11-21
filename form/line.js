import { Form } from './form.js';

export class Line extends Form {
  constructor(steps, start, finish, normal) {
    const vertices = [];

    const step_x = (finish.x - start.x) / steps;
    const step_y = (finish.y - start.y) / steps;
    const step_z = (finish.z - start.z) / steps;

    for (let i = 0; i <= steps; i++) {
      const vertice = {
        position: {},
        normal: {},
      };

      vertice.position.x = (i * step_x) + start.x;
      vertice.position.z = (i * step_z) + start.z;
      vertice.position.y = (i * step_y) + start.y;

      vertice.normal.x = normal.x;
      vertice.normal.z = normal.z;
      vertice.normal.y = normal.y;

      vertices.push(vertice);
    }

    super(vertices, steps + 1);
  }
}
