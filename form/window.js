import { Form } from './form.js';

export class Window extends Form {
  constructor(length, radius) {
    const vertices = [];
    const delta = 1 / length;

    let vertice = {
      position: {
        x: radius,
        y: -radius,
        z: 0,
      },
      normal: {
        x: Math.cos(Math.PI / 4),
        y: -Math.sin(Math.PI / 4),
        z: 0,
      },
    };

    vertices.push(vertice);

    for (let i = 0; i <= 0.501; i += delta) {
      const vertice = {
        position: {},
        normal: {},
      };
      const x = Math.cos(2 * Math.PI * i);
      const y = Math.sin(2 * Math.PI * i);

      vertice.position.x = radius * x;
      vertice.position.z = 0;
      vertice.position.y = radius * y;

      vertice.normal.x = x;
      vertice.normal.z = 0;
      vertice.normal.y = y;

      vertices.push(vertice);
    }

    vertice = {
      position: {
        x: -radius,
        y: -radius,
        z: 0,
      },
      normal: {
        x: -Math.cos(Math.PI / 4),
        y: -Math.sin(Math.PI / 4),
        z: 0,
      },
    };

    vertices.push(vertice);

    vertice = {
      position: {
        x: radius,
        y: -radius,
        z: 0,
      },
      normal: {
        x: Math.cos(Math.PI / 4),
        y: -Math.sin(Math.PI / 4),
        z: 0,
      },
    };

    vertices.push(vertice);

    super(vertices, vertices.length);
  }
}
