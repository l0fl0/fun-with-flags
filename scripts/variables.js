let apiResponse = {}, apiResponseWithoutStates = {};
let guessOptions = {
  choice: "",
  correctChoice: ""
};
let user = {
  name: "",
  score: 0,
  lives: 5,
  difficulty: "standard",
  guessResults: {
    incorrectFlags: [],
    correctFlags: []
  }
};
let timeLimit = 8000, timerCountdown = 0;


let users = [];
// check to see if storage exists and then set user obj to local storage
if (JSON.parse(localStorage.getItem("users"))) users = JSON.parse(localStorage.getItem("users"));