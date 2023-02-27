import _ from "lodash";

// css
import "./styles/style.css";

import { World } from "./world/World";

// create scene-container
function createSceneContainer() {
  const element = document.createElement("div");
  element.setAttribute("id", "scene-container");
  return element;
}

function createMenuContainer() {
  const element = document.createElement("div");

  const infoText = document.createElement("div");
  infoText.setAttribute("id", "infotext");
  infoText.classList.add("info-container");

  const helperText = document.createElement("div");
  const scoreText = document.createElement("div");
  scoreText.classList.add("info-score");

  helperText.textContent = "Appuyer sur P pour mettre en pause";

  infoText.appendChild(helperText);
  infoText.appendChild(scoreText);

  const menu = document.createElement("div");
  menu.setAttribute("id", "menu");

  const menuTitle = document.createElement("div");
  menuTitle.classList.add("menu-title");

  const buttons = document.createElement("div");
  buttons.classList.add("buttons-container");
  buttons.setAttribute("id", "buttons");

  const menuButton = document.createElement("button");
  menuButton.setAttribute("id", "menuButton");

  const mainButton = document.createElement("button");
  mainButton.setAttribute("id", "mainButton");
  mainButton.textContent = "Retour au Menu Principal";

  buttons.appendChild(menuButton);
  buttons.appendChild(mainButton);

  menu.appendChild(menuTitle);
  menu.appendChild(buttons);

  element.appendChild(infoText);
  element.appendChild(menu);

  element.setAttribute("id", "menu-container");
  return element;
}

async function main() {
  // create & add container
  let isIntoMenu = false;

  const sceneContainer = createSceneContainer();
  document.body.appendChild(sceneContainer);

  const menuContainer = createMenuContainer();
  document.body.appendChild(menuContainer);

  // create three js world
  const world = new World(sceneContainer);
  await world.init();
  mainMenu("show");

  // Menu button
  window.addEventListener("keydown", (e) => {
    if (e.key == "p") {
      let menu = document.getElementById("menu");
      let menuButton = document.getElementById("menuButton");

      if (!isIntoMenu) {
        world.stop();
        menuContainer.classList.add("into-menu");
        pausedMenu("show");
      } else {
        world.start();
        menuContainer.classList.remove("into-menu");
        pausedMenu("hide");
      }
      isIntoMenu = !isIntoMenu;
    }
  });

  // menu button
  document.getElementById("menuButton").addEventListener("click", () => {
    let menu = document.getElementById("menu");
    let buttons = document.getElementById("buttons");
    // do replay action
    if (menu.classList.contains("death-menu")) {
      menu.classList.remove("death-menu", "visible");
      buttons.classList.remove("visible");
      menuContainer.classList.remove("into-menu");
      world.reset();
    } else if (menu.classList.contains("paused-menu")) {
      world.start();
      menuContainer.classList.remove("into-menu");
      pausedMenu("hide");
      isIntoMenu = !isIntoMenu;
    } else if (menu.classList.contains("main-menu")) {
      world.reset();
      world.start();
      menuContainer.classList.remove("into-menu");
      mainMenu("hide");
    }
  });

  // mainButton
  document.getElementById("mainButton").addEventListener("click", () => {
    let menu = document.getElementById("menu");
    let buttons = document.getElementById("buttons");
    menuContainer.classList.add("into-menu");
    menu.classList.remove("death-menu", "paused-menu");
    mainMenu("show");
  });
}

let mainMenu = function (action) {
  let menu = document.getElementById("menu");
  let buttons = document.getElementById("buttons");

  if (action == "show") {
    menu.classList.add("main-menu", "visible");
    menu.children[0].textContent = "Menu principal";
    buttons.children[0].textContent = "Jouer";
    buttons.children[1].classList.add("invisible");
    buttons.classList.add("visible");
  } else if (action == "hide") {
    menu.classList.remove("main-menu", "visible");
    buttons.classList.remove("visible");
    buttons.children[1].classList.remove("invisible");
  }
};

let pausedMenu = function (action) {
  let menu = document.getElementById("menu");
  let buttons = document.getElementById("buttons");

  if (action == "show") {
    menu.classList.add("paused-menu", "visible");
    menu.children[0].textContent = "Pause";
    buttons.children[0].textContent = "Continuer";

    buttons.classList.add("visible");
  } else if (action == "hide") {
    menu.classList.remove("paused-menu", "visible");
    buttons.classList.remove("visible");
  }
};

main().catch((err) => {
  console.error(err);
});
