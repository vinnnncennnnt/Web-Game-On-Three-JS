import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  // controls options
  controls.enabled = false;
  // controls.enableRotate = false;
  // controls.enableZoom = false;
  // controls.enablePan = false;
  // controls.enableDamping = true;
  // controls.enableKeys = false;

  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
