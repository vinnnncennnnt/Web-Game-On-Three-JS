import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Box3,
  Vector3,
} from "three";

import * as placement from "../../variables.js";

import robotModel from "./../../assets/models/RobotExpressive.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnimationMixer } from "three";
import { MeshBasicMaterial } from "three";
import { LoopOnce } from "three";
import { LoopPingPong } from "three";

class Player {
  constructor() {
    this.type = "player";

    this.scale = 0.3;

    // moving booleans
    this.isJumping = false;
    this.isJumpingOnRunUp = false;
    this.isCrouching = false;
    this.isFalling = false;
    this.isGoingLeft = false;
    this.isGoingRight = false;
    this.isUnderground = false;
    this.isRunningUp = false;
    this.isDead = false;

    this.isDeathMenuDisplayed = false;

    // animation variables
    this.actionState = 0;
    this.actionSteps = 20;
    this.jumpState = 0;
    this.jumpSteps = 20;
    this.crouchState = 0;
    this.crouchSteps = 20;
    this.undergroundState = 0;
    this.undergroundSteps = 30;
    this.actionRotation = MathUtils.degToRad(5);
  }

  async init() {
    const loader = new GLTFLoader();
    const robotData = await loader.loadAsync(robotModel);

    console.log("robotData", robotData);

    this.mesh = robotData.scene.children[0];
    this.mixer = new AnimationMixer(this.mesh);

    // load animations
    this.dance = this.mixer.clipAction(robotData.animations[0]);
    this.death = this.mixer.clipAction(robotData.animations[1]);
    this.idle = this.mixer.clipAction(robotData.animations[2]);
    this.jump = this.mixer.clipAction(robotData.animations[3]);
    this.no = this.mixer.clipAction(robotData.animations[4]);
    this.punch = this.mixer.clipAction(robotData.animations[5]);
    this.run = this.mixer.clipAction(robotData.animations[6]);
    this.sit = this.mixer.clipAction(robotData.animations[7]);
    this.stand = this.mixer.clipAction(robotData.animations[8]);
    this.thumbsUp = this.mixer.clipAction(robotData.animations[9]);
    this.walk = this.mixer.clipAction(robotData.animations[10]);
    this.walkJump = this.mixer.clipAction(robotData.animations[11]);
    this.wave = this.mixer.clipAction(robotData.animations[12]);
    this.yes = this.mixer.clipAction(robotData.animations[13]);

    this.jump.setLoop(LoopOnce);
    this.jump.setDuration(1.5);

    this.death.setLoop(LoopOnce);
    this.death.clampWhenFinished = true;
    this.death.setDuration(1.5);

    this.mesh.hitbox = new BoxBufferGeometry(1, 1, 1);
    this.mesh.hitbox.computeBoundingBox();

    this.boundingBox = new Box3(new Vector3(), new Vector3());
    this.boundingBox.setFromObject(this.mesh);

    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, MathUtils.degToRad(180), 0);
    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  move(direction) {
    if (!this.isDead) {
      switch (direction) {
        case "left":
          if (!this.isGoingRight && this.mesh.position.x != placement.ON_LEFT)
            this.isGoingLeft = true;
          break;
        case "right":
          if (!this.isGoingLeft && this.mesh.position.x != placement.ON_RIGHT)
            this.isGoingRight = true;
          break;
        case "up":
          this.isJumping = true;
          if (this.isRunningUp && !this.isJumpingOnRunUp) {
            this.isJumpingOnRunUp = true;
            this.jumpState = 0;
          }
          break;
        case "down":
          if (this.mesh.position.y == placement.ON_DOWN && !this.isUnderground)
            this.isUnderground = true;
          else if (!this.isRunningUp) this.isCrouching = true;
          break;
      }
    }
  }

  reset() {
    this.isJumpingOnRunUp = false;
    this.isCrouching = false;
    this.isGoingLeft = false;
    this.isGoingRight = false;
    this.isUnderground = false;
    this.isRunningUp = false;
    this.isDead = false;
    this.isDeathMenuDisplayed = false;

    this.isFalling = false;
    this.isJumping = true;
    this.mesh.position.y = placement.ON_UP;
  }

  tick(delta) {
    // animate character
    this.animate(delta);

    if (this.isDead) {
      if (!this.isDeathMenuDisplayed) {
        this.displayDeathMenu();
        this.isDeathMenuDisplayed = true;
      }
    }
    // animate movement
    else {
    }

    if (this.isCrouching) {
      this.crouchAction();
    } else if (this.isFalling) {
      this.fallAction();
    } else if (this.isUnderground) {
      this.undergroundAction();
    } else if (this.isJumping) {
      this.jumpAction();
      // console.log(this.isJumping);
    }
    // else if (this.isRunningUp) this.runUp();

    if (this.isGoingLeft) this.leftAction();
    if (this.isGoingRight) this.rightAction();

    // move bounding box
    this.boundingBox
      .copy(this.mesh.hitbox.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
  }

  displayDeathMenu() {
    let menu = document.getElementById("menu");
    let buttons = document.getElementById("buttons");
    menu.classList.add("death-menu", "visible");
    menu.children[0].textContent = "Perdu ...";
    buttons.children[0].textContent = "Rejouer";
    document.getElementById("menu-container").classList.add("into-menu");
    setTimeout(() => {
      buttons.classList.add("visible");
    }, 1000);
  }

  animate(delta) {
    if (this.isDead) {
      this.run.stop();
      this.jump.stop();
      this.death.play();
    } else if (this.isJumping || this.isJumpingOnRunUp) {
      this.death.stop();
      this.run.stop();
      this.jump.play();
    } else {
      this.death.stop();
      this.jump.stop();
      this.run.play();
    }
    this.mixer.update(delta);
  }

  // CHECKING COLLISIONS
  // ==========================================================================

  // is the front face of the player intersecting with an ennemy
  intersectsSides(ennemy) {
    // are they on the same X coordinates
    if (
      this.boundingBox.max.x < ennemy.max.x &&
      this.boundingBox.min.x > ennemy.min.x
    ) {
      // are they on the same Y coordinates
      if (
        this.boundingBox.min.y + this.scale * 0.8 <= ennemy.max.y &&
        this.boundingBox.max.y >= ennemy.min.y
      ) {
        // are they hitting
        if (
          this.boundingBox.min.z < ennemy.max.z &&
          this.boundingBox.min.z > ennemy.min.z
        )
          return true;
      }
    }
    return false;
  }

  intersectsBottom(ennemy) {
    // are they on the same X coordinates
    if (
      this.boundingBox.max.x < ennemy.max.x &&
      this.boundingBox.min.x > ennemy.min.x
    ) {
      // are they on the same Y coordinates
      if (
        this.boundingBox.min.y <= ennemy.max.y &&
        this.boundingBox.max.y >= ennemy.min.y
      ) {
        // are they hitting
        if (
          this.boundingBox.min.z < ennemy.max.z &&
          this.boundingBox.min.z > ennemy.min.z
        )
          return true;
      }
    }
    return false;
  }

  // ACTIONS
  // ==========================================================================
  leftAction() {
    if (this.actionState <= this.actionSteps) {
      // movement
      this.mesh.position.x += placement.ON_LEFT / this.actionSteps;

      // rotation
      if (this.actionState < Math.round(this.actionSteps / 3)) {
        this.mesh.rotateZ(-this.actionRotation);
      } else if (
        this.actionState >
        this.actionSteps - Math.round(this.actionSteps / 3)
      ) {
        this.mesh.rotateZ(this.actionRotation);
      }
      this.actionState++;
    } else {
      // reset back to new position
      this.mesh.position.x = Math.round(this.mesh.position.x);
      this.isGoingLeft = false;
      this.actionState = 0;
    }
  }

  rightAction() {
    if (this.actionState <= this.actionSteps) {
      // movement
      this.mesh.position.x += placement.ON_RIGHT / this.actionSteps;

      // rotation
      if (this.actionState < Math.round(this.actionSteps / 3)) {
        this.mesh.rotateZ(this.actionRotation);
      } else if (
        this.actionState >
        this.actionSteps - Math.round(this.actionSteps / 3)
      ) {
        this.mesh.rotateZ(-this.actionRotation);
      }
      this.actionState++;
    } else {
      // reset back to new position
      this.mesh.position.x = Math.round(this.mesh.position.x);
      this.isGoingRight = false;
      this.actionState = 0;
    }
  }

  undergroundAction() {
    if (this.undergroundState <= this.undergroundSteps) {
      if (this.undergroundState < Math.round(this.undergroundSteps / 4))
        this.mesh.position.y +=
          placement.ON_UNDERGROUND / (this.undergroundSteps / 4);
      if (
        this.undergroundState >
        this.undergroundSteps - Math.round(this.undergroundSteps / 4)
      )
        this.mesh.position.y -=
          placement.ON_UNDERGROUND / (this.undergroundSteps / 4);
      this.undergroundState++;
    } else {
      this.mesh.position.y = placement.ON_DOWN;
      this.isUnderground = false;
      this.undergroundState = 0;
    }
  }

  crouchAction() {
    if (this.mesh.position.y > placement.ON_DOWN) {
      this.isFalling = true;
      this.mesh.position.y -= placement.ON_UP / (this.jumpSteps / 3);
    } else {
      this.mesh.position.y = placement.ON_DOWN;
      this.isJumping = false;
      this.isFalling = false;
      this.isCrouching = false;
      this.jumpState = 0;
    }
  }

  jumpAction() {
    if (this.jumpState <= this.jumpSteps) {
      this.mesh.position.y += placement.ON_UP / 2 ** (this.jumpState + 1);
      this.jumpState++;
    } else {
      this.isFalling = true;
      this.isJumpingOnRunUp = false;
    }
  }

  fallAction() {
    if (this.mesh.position.y > placement.ON_DOWN) {
      this.mesh.position.y -= placement.ON_UP / (this.jumpSteps * 3);
    } else {
      this.mesh.position.y = placement.ON_DOWN;
      this.isJumping = false;
      this.isJumpingOnRunUp = false;
      this.isFalling = false;
      this.isCrouching = false;
      this.jumpState = 0;
    }
  }

  runUp() {
    if (!this.isJumpingOnRunUp) this.isJumping = false;
    this.isJumpingOnRunUp = false;
    this.isFalling = false;
    this.isCrouching = false;
    this.isRunningUp = true;
  }

  runUpStop() {
    this.isFalling = true;
    this.isRunningUp = false;
  }

  die() {
    this.isDead = true;
  }
}

export { Player };
