import { startGame } from "./fun-with-flag-game.js";

const howToEl = document.querySelector(".how-to-play");
const registerEl = document.querySelector(".register");
const gameEl = document.querySelector(".fwf-game");


function hideSections() {
  howToEl.classList.add("hide");
  registerEl.classList.add("hide");
}

function showGame() {
  gameEl.classList.add("show");
}

// Form submit handler
function handleSubmit(event) {
  event.preventDefault();
  user.name = event.target.name.value;
  setTimeout(() => {
    hideSections();
    showGame();
    startGame();
  }, 500)
};

const formEl = document.querySelector(".register__form");
