import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Box3,
  Vector3,
  Color,
} from "three";

import * as placement from "../../variables.js";

import trainModel from "./../../assets/models/train.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "three";

class Ennemy {
  constructor() {
    this.color = new Color("rgb(255, 255, 255)");
    this.color2 = new Color("rgb(255, 0, 0)");
    this.color3 = new Color("rgb(0, 255, 0)");

    this.type = "ennemy";
    this.startingIntersection = 2;

    // const geometry = new BoxBufferGeometry(2, 2, 25);
    // const material = new MeshStandardMaterial({ color: this.color });
    // this.mesh = new Mesh(geometry, material);

    // this.boundingBox = new Box3(new Vector3(), new Vector3());
    // this.boundingBox.setFromObject(this.mesh);

    this.framesBeforeSpeedUp = 100;
    this.speedIncrease = 1;
    this.currentFrame = 0;
    this.maxSpeed = 60;

    this.oneSecondMouvement = 10;
    this.startingZPosition = -35;
    this.outOfSightZPosition = 15;

    //this.set();
  }

  async init() {
    const loader = new GLTFLoader();
    const trainData = await loader.loadAsync(trainModel);

    console.log("train", trainData);

    // const train = trainData.scene.children[0];
    this.mesh = trainData.scene.children[0].children[0];
    //this.boundingBox = this.mesh.geometry.boundingBox;
    this.boundingBox = new Box3(new Vector3(), new Vector3());
    this.boundingBox.setFromObject(this.mesh);

    //console.log("train mesh", train);
    // this.train.position.set(0, 0, 0);
    // this.train.rotation.set(0, MathUtils.degToRad(180), 0);
    this.mesh.scale.set(0.014, 0.014, 0.014);
    this.set();
  }

  tick(delta, player) {
    // collisions with player ON SIDES
    if (player.intersectsBottom(this.boundingBox)) {
      if (player.intersectsSides(this.boundingBox)) {
        this.mesh.material.color = this.color2;

        if (this.startingIntersection == 0) {
          player.die();
        } else {
          this.startingIntersection--;
        }
      } else {
        this.mesh.material.color = this.color3;
        player.runUp();
      }
    } else {
      this.mesh.material.color = this.color;
      if (player.isRunningUp) player.runUpStop();
    }

    // Increase speed
    if (
      this.currentFrame >= this.framesBeforeSpeedUp &&
      this.oneSecondMouvement < this.maxSpeed
    ) {
      this.oneSecondMouvement += this.speedIncrease;
      this.currentFrame = 0;
    }

    // if (this.boundingBox.containsBox(player.boundingBox))
    //   player.mesh.position.y = 2;

    // check out of sight
    if (this.mesh.position.z > this.outOfSightZPosition && !player.isDead)
      this.set();

    // move forward
    this.mesh.position.z += this.oneSecondMouvement * delta;
    this.currentFrame++;

    // move boundingBox
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
  }

  reset() {
    this.set();
    this.oneSecondMouvement = 10;
    this.currentFrame = 0;
  }

  set() {
    switch (getRandomInt(0, 3)) {
      case 0:
        this.mesh.position.x = placement.ON_RIGHT;
        break;
      case 1:
        this.mesh.position.x = placement.ON_MIDDLE;
        break;
      case 2:
        this.mesh.position.x = placement.ON_LEFT;
        break;
    }
    this.mesh.position.z = this.startingZPosition;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export { Ennemy };
