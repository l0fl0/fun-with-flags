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
  // localStorage.setItem("user", JSON.stringify(user));


  setTimeout(() => {
    hideSections();
    showGame()
  }, 1000)

  buildUserInfo(user)
};

const formEl = document.querySelector(".register__form");

formEl.addEventListener("submit", handleSubmit);