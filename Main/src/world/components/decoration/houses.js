import { create, groupBy } from "lodash";
import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  MeshBasicMaterial,
  TextureLoader,
  Group,
} from "three";

import * as placement from "../../variables.js";

function createHouses(position) {
  const houses = new Group();
  houses.type = "decoration";

  const numberOfHouses = 3;
  const sizeTaken = 15;

  let houseStartingZPos = -45;
  for (let i = 0; i < numberOfHouses; i++) {
    let house;
    switch (getRandomInt(0, 3)) {
      case 0:
        house = createHouse1(position);
        break;
      case 1:
        house = createHouse2(position);
        break;
      case 2:
        house = createHouse3(position);
        break;
    }

    house.position.z = houseStartingZPos + i * sizeTaken;
    houses.add(house);
  }

  switch (position) {
    case "left":
      houses.position.x = placement.ON_LEFT_DECORATION;
      break;
    case "right":
      houses.position.x = placement.ON_RIGHT_DECORATION;
      break;
  }
  console.log(houses);

  houses.tick = (delta) => {
    houses.children.forEach((house) => {
      house.position.z += 0.1;
      if (house.position.z >= 10) house.position.z = houseStartingZPos + 10;
    });
  };

  return houses;
}

function createHouse1(position) {
  let dimension = { x: 5, y: 5, z: 14 };
  let hypotenus = Math.sqrt((dimension.x / 2) ** 2 * 2);

  // create geometry / materials
  const wallGeometry = new BoxBufferGeometry(
    dimension.x,
    dimension.y,
    dimension.z
  );
  const roofGeometry = new BoxBufferGeometry(
    hypotenus,
    hypotenus,
    dimension.z - 0.01
  );
  const doorGeometry = new PlaneGeometry(2, 3);
  const windowGeometry = new PlaneGeometry(2.5, 2);

  const wallMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const doorMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const roofMaterial = new MeshStandardMaterial({ color: getRandRGB() });
  const windowMaterial = new MeshStandardMaterial({ color: getRandRGB() });

  const house = new Group();

  let walls = new Mesh(wallGeometry, wallMaterial);
  let roof = new Mesh(roofGeometry, roofMaterial);
  let door = new Mesh(doorGeometry, doorMaterial);
  let windowleft = new Mesh(windowGeometry, windowMaterial);
  let windowright = new Mesh(windowGeometry, windowMaterial);
  house.add(walls, roof, door, windowleft, windowright);

  roof.rotateZ(MathUtils.degToRad(45));
  roof.position.y = dimension.y / 2;

  door.position.z = 5;
  windowleft.position.z = -3;
  windowright.position.z = 1;

  windowleft.position.y = 1;
  windowright.position.y = 1;

  switch (position) {
    case "left":
      door.rotateY(MathUtils.degToRad(90));
      door.position.x = dimension.x / 2 + 0.01;
      windowleft.rotateY(MathUtils.degToRad(90));
      windowleft.position.x = dimension.x / 2 + 0.01;
      windowright.rotateY(MathUtils.degToRad(90));
      windowright.position.x = dimension.x / 2 + 0.01;
      break;
    case "right":
      door.rotateY(MathUtils.degToRad(270));
      door.position.x = -(dimension.x / 2 + 0.01);
      windowleft.rotateY(MathUtils.degToRad(270));
      windowleft.position.x = -(dimension.x / 2 + 0.01);
      windowright.rotateY(MathUtils.degToRad(270));
      windowright.position.x = -(dimension.x / 2 + 0.01);
      break;
  }

  return house;
}

function createHouse2(position) {
  let dimension = { x: 5, y: 5, z: 14 };
  let dimensionStage = { x: 5, y: 10, z: 7 };
  let hypotenus = Math.sqrt((dimension.x / 2) ** 2 * 2);

  // create geometry / materials
  const wallGeometry = new BoxBufferGeometry(
    dimension.x,
    dimension.y,
    dimension.z
  );
  const roofGeometry = new BoxBufferGeometry(
    hypotenus,
    hypotenus,
    dimension.z - 0.01
  );

  const stageGeometry = new BoxBufferGeometry(
    dimensionStage.x,
    dimensionStage.y,
    dimensionStage.z
  );

  const doorGeometry = new PlaneGeometry(2, 3);
  const windowGeometry = new PlaneGeometry(2.5, 2);

  const wallMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const doorMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const roofMaterial = new MeshStandardMaterial({ color: getRandRGB() });
  const windowMaterial = new MeshStandardMaterial({ color: getRandRGB() });

  const house = new Group();

  let walls = new Mesh(wallGeometry, wallMaterial);
  let stage = new Mesh(stageGeometry, wallMaterial);
  let roof = new Mesh(roofGeometry, roofMaterial);
  let door = new Mesh(doorGeometry, doorMaterial);
  let windowleft = new Mesh(windowGeometry, windowMaterial);
  let windowright = new Mesh(windowGeometry, windowMaterial);

  house.add(walls, stage, roof, door, windowleft, windowright);

  roof.rotateZ(MathUtils.degToRad(45));
  roof.position.y = dimension.y / 2;

  stage.position.z = 0;

  door.position.z = 5;
  windowleft.position.z = -3;
  windowright.position.z = 1;

  windowleft.position.y = 1;
  windowright.position.y = 1;

  switch (position) {
    case "left":
      door.rotateY(MathUtils.degToRad(90));
      door.position.x = dimension.x / 2 + 0.01;
      windowleft.rotateY(MathUtils.degToRad(90));
      windowleft.position.x = dimension.x / 2 + 0.01;
      windowright.rotateY(MathUtils.degToRad(90));
      windowright.position.x = dimension.x / 2 + 0.01;
      break;
    case "right":
      door.rotateY(MathUtils.degToRad(270));
      door.position.x = -(dimension.x / 2 + 0.01);
      windowleft.rotateY(MathUtils.degToRad(270));
      windowleft.position.x = -(dimension.x / 2 + 0.01);
      windowright.rotateY(MathUtils.degToRad(270));
      windowright.position.x = -(dimension.x / 2 + 0.01);
      break;
  }

  return house;
}

function createHouse3(position) {
  let dimension = { x: 5, y: 10, z: 7 };
  let hypotenus = Math.sqrt((dimension.x / 2) ** 2 * 2);

  // create geometry / materials
  const wallGeometry = new BoxBufferGeometry(
    dimension.x,
    dimension.y,
    dimension.z
  );

  const barrierGeometry = new BoxBufferGeometry(0.1, 0.2, dimension.z);
  const barrierStopGeometry = new BoxBufferGeometry(0.2, 2.5, 0.2);

  const gardenGeometry = new BoxBufferGeometry(dimension.x, 0.1, dimension.z);
  const roofGeometry = new BoxBufferGeometry(
    hypotenus,
    hypotenus,
    dimension.z / 2 - 0.01
  );
  const doorGeometry = new PlaneGeometry(2, 3);
  const windowGeometry = new PlaneGeometry(2.5, 2);

  const wallMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const gardenMaterial = new MeshStandardMaterial({
    color: "green",
  });
  const barrierMaterial = new MeshStandardMaterial({
    color: "white",
  });
  const doorMaterial = new MeshStandardMaterial({
    color: getRandRGB(),
  });
  const roofMaterial = new MeshStandardMaterial({ color: getRandRGB() });
  const windowMaterial = new MeshStandardMaterial({ color: getRandRGB() });

  const house = new Group();

  let walls = new Mesh(wallGeometry, wallMaterial);
  let roof = new Mesh(roofGeometry, roofMaterial);
  let door = new Mesh(doorGeometry, doorMaterial);
  let window = new Mesh(windowGeometry, windowMaterial);
  let garden = new Mesh(gardenGeometry, gardenMaterial);
  let barrierTop = new Mesh(barrierGeometry, barrierMaterial);
  let barrierBottom = new Mesh(barrierGeometry, barrierMaterial);
  let barrierStopFar = new Mesh(barrierStopGeometry, barrierMaterial);
  let barrierStopClose = new Mesh(barrierStopGeometry, barrierMaterial);
  house.add(
    walls,
    roof,
    door,
    window,
    garden,
    barrierBottom,
    barrierTop,
    barrierStopFar,
    barrierStopClose
  );

  roof.rotateZ(MathUtils.degToRad(45));
  roof.position.y = dimension.y;

  barrierBottom.position.z = -3.5;
  barrierBottom.position.y = 1;
  barrierTop.position.z = -3.5;
  barrierTop.position.y = 0.2;

  barrierStopFar.position.z = -7;
  barrierStopClose.position.z = 0;

  walls.position.z = 3.5;

  garden.position.z = -3.5;
  garden.position.y = -1.2;

  door.position.z = 5;

  window.position.z = 3.5;
  window.position.y = 4;

  switch (position) {
    case "left":
      door.rotateY(MathUtils.degToRad(90));
      door.position.x = dimension.x / 2 + 0.01;
      window.rotateY(MathUtils.degToRad(90));
      window.position.x = dimension.x / 2 + 0.01;
      barrierTop.position.x = dimension.x / 2 + 0.01;
      barrierBottom.position.x = dimension.x / 2 + 0.01;
      barrierStopFar.position.x = dimension.x / 2 + 0.01;
      barrierStopClose.position.x = dimension.x / 2 + 0.01;
      break;
    case "right":
      door.rotateY(MathUtils.degToRad(270));
      door.position.x = -(dimension.x / 2 + 0.01);
      window.rotateY(MathUtils.degToRad(270));
      window.position.x = -(dimension.x / 2 + 0.01);
      barrierTop.position.x = -(dimension.x / 2 + 0.01);
      barrierBottom.position.x = -(dimension.x / 2 + 0.01);
      barrierStopFar.position.x = -(dimension.x / 2 + 0.01);
      barrierStopClose.position.x = -(dimension.x / 2 + 0.01);
      break;
  }

  return house;
}

function getRandRGB() {
  let red = getRandomInt(0, 256);
  let green = getRandomInt(0, 256);
  let blue = getRandomInt(0, 256);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export { createHouses };
