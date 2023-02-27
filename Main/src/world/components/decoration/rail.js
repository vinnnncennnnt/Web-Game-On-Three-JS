import {
  BoxBufferGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Group,
} from "three";

import * as placement from "../../variables.js";

function createRail(position) {
  // create geometry / materials
  const railGeometry = new BoxBufferGeometry(0.3, 0.2, 30);
  const roadGeometry = new BoxBufferGeometry(6, 0.2, 30);
  const boardGeometry = new BoxBufferGeometry(3, 0.1, 1);

  const railMaterial = new MeshStandardMaterial({ color: "rgb(90, 90, 90)" });
  const boardMaterial = new MeshStandardMaterial({ color: "rgb(135, 62, 35)" });
  const roadMaterial = new MeshStandardMaterial({ color: "rgb(38, 38, 38)" });

  const rail = new Group();
  rail.type = "decoration";

  const railLeft = new Mesh(railGeometry, railMaterial);
  const railRight = new Mesh(railGeometry, railMaterial);

  const road = new Mesh(roadGeometry, roadMaterial);

  let boardsStatingZPos = -15;

  let boards = [];
  for (let i = 0; i < 16; i++) {
    boards[i] = new Mesh(boardGeometry, boardMaterial);
    boards[i].position.z = boardsStatingZPos + i * 2;
    rail.add(boards[i]);
  }

  rail.add(railLeft);
  rail.add(railRight);
  rail.add(road);

  road.position.y = -0.3;
  road.position.z = -3;

  railLeft.position.x = -0.9;
  railRight.position.x = 0.9;

  rail.position.y = -1;
  rail.position.z = -10;

  switch (position) {
    case "left":
      rail.position.x = placement.ON_LEFT;
      break;
    case "middle":
      rail.position.x = placement.ON_MIDDLE;
      break;
    case "right":
      rail.position.x = placement.ON_RIGHT;
      break;
  }

  rail.tick = (delta) => {
    // increase the cube's rotation each frame
    boards.forEach((board) => {
      board.position.z += 0.1;
      if (board.position.z >= 15) board.position.z = boardsStatingZPos - 2;
    });
  };

  return rail;
}

export { createRail };
