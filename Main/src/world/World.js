import { createControls } from "./systems/controls.js";
import { Loop } from "./systems/Loop.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";

import { createCamera } from "./components/utils/camera.js";
import { createScene } from "./components/utils/scene.js";
import { createLights } from "./components/utils/lights.js";

import { Player } from "./components/updatables/Player.js";
import { Ennemy } from "./components/updatables/Ennemy.js";

import { createRail } from "./components/decoration/rail.js";
import { createHouses } from "./components/decoration/houses.js";

class World {
  #camera;
  #scene;
  #renderer;
  #loop;
  #player;
  #ennemy;
  #score;
  #paused;
  #atCreation;

  constructor(container) {
    this.#camera = createCamera();
    this.#scene = createScene();
    this.#renderer = createRenderer();
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
    this.#paused = false;
    this.#atCreation = true;
    container.append(this.#renderer.domElement);

    const resizer = new Resizer(container, this.#camera, this.#renderer);
  }

  async init() {
    // asynchronous setup here

    this.#score = 0;

    this.#player = new Player();
    await this.#player.init();

    this.#ennemy = new Ennemy();
    await this.#ennemy.init();

    // background
    const railRight = createRail("right");
    const railLeft = createRail("left");
    const railMiddle = createRail("middle");

    const housesRight = createHouses("right");
    const housesLeft = createHouses("left");

    let ligths = createLights();

    this.#loop.updatables.push(this.#player);
    this.#loop.updatables.push(this.#ennemy);

    this.#loop.updatables.push(railLeft);
    this.#loop.updatables.push(railRight);
    this.#loop.updatables.push(railMiddle);
    this.#loop.updatables.push(housesRight);
    this.#loop.updatables.push(housesLeft);
    //this.#loop.updatables.push(ligths[0]);

    this.#scene.add(this.#player.mesh);
    this.#scene.add(this.#ennemy.mesh);

    this.#scene.add(railLeft);
    this.#scene.add(railRight);
    this.#scene.add(railMiddle);
    this.#scene.add(housesRight);
    this.#scene.add(housesLeft);

    ligths.forEach((light) => {
      this.#scene.add(light);
    });

    // player movement
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.#player.move("left");
          break;
        case "ArrowRight":
          this.#player.move("right");
          break;
        case "ArrowUp":
          this.#player.move("up");
          break;
        case "ArrowDown":
          this.#player.move("down");
          break;
      }
    });
  }

  render() {
    // draw a single frame
    this.#renderer.render(this.#scene, this.#camera);
  }

  start() {
    this.#loop.start();
    if (this.#atCreation) {
      this.scoreCounter();
      this.#atCreation = false;
    }
    this.#paused = false;
  }

  stop() {
    this.#loop.stop();
    this.#paused = true;
  }

  reset() {
    this.#ennemy.reset();
    this.#player.reset();
    this.#score = 0;
  }

  scoreCounter(info) {
    setInterval(() => {
      if (!this.#player.isDead && !this.#paused) {
        this.#score += this.#ennemy.oneSecondMouvement;
      }
      document.getElementById("infotext").children[1].textContent = this.#score;
    }, 100);
  }

  getScore() {
    return this.#score;
  }
}

export { World };
