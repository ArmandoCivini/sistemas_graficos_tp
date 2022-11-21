function DroneCameraControl(initialPos, app, canvas) {
  const DELTA_TRASLACION = 0.1;
  const DELTA_ROTACION = 0.02;
  const FACTOR_INERCIA = 0.05;

  const { vec3 } = glMatrix;
  const { mat4 } = glMatrix;

  if (!initialPos) initialPos = [0, 0, 0];

  let position = vec3.fromValues(initialPos[0], initialPos[1], initialPos[2]);
  let rotation = vec3.create();

  let worldMatrix = mat4.create();

  const camInitialState = {
    xVel: 0,
    zVel: 0,
    yVel: 0,
    xVelTarget: 0,
    zVelTarget: 0,
    yVelTarget: 0,

    yRotVelTarget: 0,
    yRotVel: 0,
    zRotVelTarget: 0,
    zRotVel: 0,
    xRotVelTarget: 0,
    xRotVel: 0,

    angle: Math.PI / 2,
    angle_fi: Math.PI / 2,
    angle_change: 0,
    angle_change_fi: 0,
    rightAxisMode: 'move',
    zoom_orbit_castle: 7,
    zoom_orbit_catapult: 3.9,
  };

  let camState = { ...camInitialState };

  let mouseIsDown = false;

  document.addEventListener('keydown', (e) => {
    if (app.view == 'libre') {
      switch (e.key) {
        case 'ArrowUp': case 'w':
          camState.zVelTarget = DELTA_TRASLACION; break;
        case 'ArrowDown': case 's':
          camState.zVelTarget = -DELTA_TRASLACION; break;

        case 'ArrowLeft': case 'a':
          camState.xVelTarget = DELTA_TRASLACION; break;
        case 'ArrowRight': case 'd':
          camState.xVelTarget = -DELTA_TRASLACION; break;

        case 'a':
          camState.yRotVelTarget = DELTA_ROTACION; break;
        case 'd':
          camState.yRotVelTarget = -DELTA_ROTACION; break;
        case 's':
          camState.xRotVelTarget = -DELTA_ROTACION; break;
        case 'w':
          camState.xRotVelTarget = DELTA_ROTACION; break;

        case '2':
          app.view = 'castillo'; break;
        case '3':
          app.view = 'catapulta'; break;
      }
    } else {
      switch (e.key) {
        case 'ArrowUp': case 'w':
          camState.angle_change_fi = -0.05; break;
        case 'ArrowDown': case 's':
          camState.angle_change_fi = 0.05; break;
        case 'ArrowLeft': case 'a':
          camState.angle_change = -0.05; break;
        case 'ArrowRight': case 'd':
          camState.angle_change = 0.05; break;
        case '1':
          app.view = 'libre';
          rotation = vec3.create();
          position = vec3.fromValues(initialPos[0], initialPos[1], initialPos[2]);
          camState = { ...camInitialState }; break;
        case '2':
          app.view = 'castillo'; break;
        case '3':
          app.view = 'catapulta'; break;
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (app.view == 'libre') {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'ArrowDown': case 's':
          camState.zVelTarget = 0; break;

        case 'ArrowLeft': case 'a': case 'ArrowRight': case 'd':
          camState.xVelTarget = 0; break;
      }
    } else {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'ArrowDown': case 's':
          camState.angle_change_fi = 0; break;
        case 'ArrowLeft': case 'a': case 'ArrowRight': case 'd':
          camState.angle_change = 0; break;
      }
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!mouseIsDown) return;
    if (app.view == 'libre') {
      camState.xRotVelTarget = -e.movementY / 100;
      camState.yRotVelTarget = -e.movementX / 100;
    } else {
      camState.angle_change = e.movementX / 100;
      camState.angle_change_fi = -e.movementY / 100;
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    mouseIsDown = true;
  });

  canvas.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
    if (app.view == 'libre') {
      camState.xRotVelTarget = 0;
      camState.yRotVelTarget = 0;
    } else {
      camState.angle_change = 0;
      camState.angle_change_fi = 0;
    }
  });

  canvas.addEventListener('wheel', (event) => {
    if (app.view == 'libre') return;
    if (app.view == 'castillo') { camState.zoom_orbit_castle += event.deltaY / 50; }
    if (app.view == 'catapulta') { camState.zoom_orbit_catapult += event.deltaY / 50; }
  });

  this.update = function () {
    if (app.view == 'libre') {
      camState.xVel += (camState.xVelTarget - camState.xVel) * FACTOR_INERCIA;
      camState.yVel += (camState.yVelTarget - camState.yVel) * FACTOR_INERCIA;
      camState.zVel += (camState.zVelTarget - camState.zVel) * FACTOR_INERCIA;

      camState.xRotVel += (camState.xRotVelTarget - camState.xRotVel) * FACTOR_INERCIA;
      camState.yRotVel += (camState.yRotVelTarget - camState.yRotVel) * FACTOR_INERCIA;

      const translation = vec3.fromValues(-camState.xVel, camState.yVel, -camState.zVel);

      const rotIncrement = vec3.fromValues(camState.xRotVel, camState.yRotVel, camState.zRotVel);
      vec3.add(rotation, rotation, rotIncrement);

      rotation[0] = Math.min(Math.PI / 8, Math.max(-Math.PI / 8, rotation[0]));

      const rotationMatrix = mat4.create();

      mat4.rotateY(rotationMatrix, rotationMatrix, rotation[1]);
      mat4.rotateX(rotationMatrix, rotationMatrix, rotation[0]);

      vec3.transformMat4(translation, translation, rotationMatrix);
      vec3.add(position, position, translation);
      position[1] = 0;

      worldMatrix = mat4.create();
      mat4.translate(worldMatrix, worldMatrix, position);
      mat4.multiply(worldMatrix, worldMatrix, rotationMatrix);

      camState.xRotVelTarget = 0;
      camState.yRotVelTarget = 0;
    } else {
      camState.angle += camState.angle_change;
      camState.angle_fi += camState.angle_change_fi;
      camState.angle_fi = Math.max(0, Math.min(Math.PI / 2, camState.angle_fi));
      const x = Math.cos(camState.angle) * Math.sin(camState.angle_fi);
      const y = Math.cos(camState.angle_fi);
      const z = Math.sin(camState.angle) * Math.sin(camState.angle_fi);
      let center = vec3.fromValues(0, 0, 0);
      const up_direction = vec3.fromValues(0, 1, 0);

      worldMatrix = mat4.create();
      position = vec3.fromValues(camState.zoom_orbit_castle * x, camState.zoom_orbit_castle * y, camState.zoom_orbit_castle * z + 0.5);
      if (app.view == 'catapulta') {
        center = vec3.fromValues(4.49, 0, 4.78);
        position = vec3.fromValues(camState.zoom_orbit_catapult * x + center[0], camState.zoom_orbit_catapult * y, camState.zoom_orbit_catapult * z + center[2]);
      }
      mat4.translate(worldMatrix, worldMatrix, position);
      mat4.lookAt(worldMatrix, position, center, up_direction);

      mat4.invert(worldMatrix, worldMatrix);
    }
  };

  this.getViewMatrix = function () {
    const m = mat4.clone(worldMatrix);
    mat4.invert(m, m);
    return m;
  };

  this.getMatrix = function () {
    return worldMatrix;
  };

  this.changeCastleMode = function () {
    rotation = vec3.create();
    position = vec3.fromValues(initialPos[0], initialPos[1], initialPos[2]);
    camState = { ...camInitialState };
  };
}
