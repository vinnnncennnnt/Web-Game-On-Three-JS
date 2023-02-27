import { Clock } from "three";

const clock = new Clock();

class Loop {
  camera;
  scene;
  renderer;
  updatables;
  oldDelta;

  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.oldDelta = null;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.oldDelta = clock.getDelta();
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    let delta = clock.getDelta();
    if (this.oldDelta != null) {
      delta = this.oldDelta;
      this.oldDelta = null;
    }

    let player;

    for (const object of this.updatables) {
      if (object.type == "player") {
        player = object;
        object.tick(delta);
      } else if (object.type == "ennemy") {
        object.tick(delta, player);
      } else if (object.type == "decoration") {
        if (!player.isDead) object.tick(delta);
      }
    }
  }
}

export { Loop };
