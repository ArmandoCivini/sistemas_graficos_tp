import { Form } from './form.js';

// rectangle repeates the edges to have normals both ways
export class Rectangle extends Form {
  constructor(len_a, len_b) {
    const vertices = [];

    const vertice_down_left1 = {
      position: {
        x: -len_a / 2,
        y: -len_b / 2,
        z: 0,
      },
      normal: {
        x: -1,
        y: 0,
        z: 0,
      },
    };

    const vertice_down_left2 = {
      position: {
        x: -len_a / 2,
        y: -len_b / 2,
        z: 0,
      },
      normal: {
        x: 0,
        y: -1,
        z: 0,
      },
    };

    const vertice_up_left1 = {
      position: {
        x: -len_a / 2,
        y: len_b / 2,
        z: 0,
      },
      normal: {
        x: -1,
        y: 0,
        z: 0,
      },
    };

    const vertice_up_left2 = {
      position: {
        x: -len_a / 2,
        y: len_b / 2,
        z: 0,
      },
      normal: {
        x: 0,
        y: 1,
        z: 0,
      },
    };

    const vertice_down_right1 = {
      position: {
        x: len_a / 2,
        y: -len_b / 2,
        z: 0,
      },
      normal: {
        x: 1,
        y: 0,
        z: 0,
      },
    };

    const vertice_down_right2 = {
      position: {
        x: len_a / 2,
        y: -len_b / 2,
        z: 0,
      },
      normal: {
        x: 0,
        y: -1,
        z: 0,
      },
    };

    const vertice_up_right1 = {
      position: {
        x: len_a / 2,
        y: len_b / 2,
        z: 0,
      },
      normal: {
        x: 1,
        y: 0,
        z: 0,
      },
    };

    const vertice_up_right2 = {
      position: {
        x: len_a / 2,
        y: len_b / 2,
        z: 0,
      },
      normal: {
        x: 0,
        y: 1,
        z: 0,
      },
    };

    vertices.push(vertice_down_left1);
    vertices.push(vertice_up_left1);
    vertices.push(vertice_up_left2);
    vertices.push(vertice_up_right2);
    vertices.push(vertice_up_right1);
    vertices.push(vertice_down_right1);
    vertices.push(vertice_down_right2);
    vertices.push(vertice_down_left2);

    super(vertices, 8);
  }
}
