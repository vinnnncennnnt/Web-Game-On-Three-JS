import { Color, Scene} from "three";

function createScene() {
  const scene = new Scene();

  scene.background = new Color("rgb(200, 200, 200)");

  return scene;
}

export { createScene };
