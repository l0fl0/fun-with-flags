const howToEl = document.querySelector(".how-to-play");
const registerEl = document.querySelector(".register");
const formEl = document.querySelector(".register__form");
formEl.addEventListener("submit", handleSubmit);

let user = {
  name: "",
  score: 0,
  lives: 200,
  difficulty: "standard",
  guessResults: {
    incorrectFlags: [],
    correctFlags: []
  }
};

// Form submit handler
function handleSubmit(event) {
  event.preventDefault();

  // Store registration information
  user.name = event.target.name.value;
  user.difficulty = event.target.difficulty.value;

  localStorage.setItem("user", JSON.stringify(user));

  //open game
  window.location.assign("../pages/game.html");

};
