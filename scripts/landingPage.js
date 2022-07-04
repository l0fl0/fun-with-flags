import { createPageElement } from "../utils/utils.js";


const howToEl = document.querySelector(".how-to-play");
const registerEl = document.querySelector(".register");
const gameEl = document.querySelector(".fwf-game");

const userInfoContainer = document.querySelector(".fwf-game__user")
function buildUserInfo(user) {

  // let user = JSON.parse(localStorage["user"]);
  // User info 
  const userName = createPageElement("div", "fwf-game__user-name", `Player: ${user.name}`);
  userInfoContainer.appendChild(userName);

  //   // lives 
  //   const userLifeElement = createPageElement("div", "fwf-game__user-lives", `Lives: ${user.lives}`);
  //   userInfoContainer.appendChild(userLifeElement);

  //   // score 
  //   const userScore = createPageElement("div", "fwf-game__user-score", `Score: ${user.score}`);
  //   userInfoContainer.appendChild(userScore);
};

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
  // localStorage.setItem("user", JSON.stringify(user));


  setTimeout(() => {
    hideSections();
    showGame()
  }, 500)

  buildUserInfo(user)
};

const formEl = document.querySelector(".register__form");

formEl.addEventListener("submit", handleSubmit);