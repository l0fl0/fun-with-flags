let user = {
  name: "",
  score: 0,
  lives: 3,
  difficulty: "standard",
  guessResults: {
    incorrectFlags: [],
    correctFlags: []
  }
};

const formEl = document.querySelector(".registration-form");
formEl.addEventListener("submit", handleSubmit);

const difficultyOptions = document.querySelectorAll(".registration-form__game-option");
difficultyOptions.forEach(el => el.addEventListener("click", activeDifficulty));

function activeDifficulty(event) {
  difficultyOptions.forEach(el => el.labels[0].classList.remove("registration-form__label--active"));
  event.target.labels[0].classList.add("registration-form__label--active");
}

// Form submit handler
function handleSubmit(event) {
  event.preventDefault();

  // Store registration information
  user.name = event.target.username.value;
  user.difficulty = event.target.difficulty.value;

  localStorage.setItem("user", JSON.stringify(user));

  //open game
  window.location.assign("./pages/FWFGame/index.html");
};

let usernameInput = document.getElementById("username");
usernameInput.focus();