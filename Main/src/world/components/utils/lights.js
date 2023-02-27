import { DirectionalLight, AmbientLight, HemisphereLight } from "three";

function createLights() {
  let sun = new DirectionalLight("white", 8);
  sun.position.set(-5, 5, 0);

  // sun.ticksBeforeUpdate = 50;
  // sun.currentTick = 0;
  // sun.type = "decoration";
  // sun.tick = (delta) => {
  //   sun.currentTick++;
  //   if (sun.currentTick % sun.ticksBeforeUpdate == 0) sun.position.x++;
  // };

  const ambiant = new AmbientLight(0xffffff, 1);

  // const skyColor = 0xffffff; // light blue
  // const groundColor = 0x000000; // brownish orange
  // const intensity = 5;
  // const light3 = new HemisphereLight(skyColor, groundColor, intensity);

  // the first on emust be the updatable
  return [sun, ambiant];
}

export { createLights };
