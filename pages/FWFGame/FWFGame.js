import { createPageElement, shuffle, getRandomInt } from "../../scripts/utils.js";
import { move } from "../../scripts/ProgressBarAnimation.js";

let apiResponse = {}, apiResponseWithoutStates = {}, gameFlags = [];
let user = JSON.parse(localStorage.getItem("user"));
let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
let timeLimit = 6000;
let countdown = 0;
let guessOptions = {
  choice: null,
  correctChoice: null,
  timeRemaining: null
};

function buildUserInfo(user) {
  // User info 
  const username = document.querySelector(".user-info__username")
  username.innerText = `${user.name}`

  const countdownTimer = document.querySelector(".user-info__countdown");
  countdownTimer.innerText = `Countdown: ${timeLimit / 1000}`;

  startCountdown(timeLimit);
};

function buildGameContainer(data) {
  const flagContainer = document.querySelector(".fwf__flag-container");
  const options = document.querySelector(".fwf__options");

  flagContainer.innerHTML = "";
  options.innerHTML = "";

  // Flag
  const flagEl = createPageElement("img", "fwf__flag");
  flagEl.setAttribute("src", data.flag);
  flagContainer.appendChild(flagEl);


  // Country Options
  data.countries.forEach(countryOption => {
    let countryOptionBtn = createPageElement("li", "fwf__country-option", countryOption.country);
    countryOptionBtn.addEventListener("click", handleOptionSelect);
    countryOptionBtn.setAttribute("cc", countryOption.countryCode);

    options.appendChild(countryOptionBtn);
  });

  function handleOptionSelect(event) {
    event.preventDefault();
    guessOptions.timeRemaining = countdown;

    //remove active choice css
    if (document.querySelector(".fwf__country-option--active")) {
      document.querySelector(".fwf__country-option--active").classList.remove("fwf__country-option--active")
    }
    //add active choice css
    event.target.classList.add("fwf__country-option--active");
    //kep track of answer choice
    guessOptions.choice = event.target.attributes.cc.value;
  };
}

const showCountryFlag = (countries) => {
  let countryKeys = Object.keys(countries);

  /**
 * Returns Random Country code from counrtyCodes Array
 */
  const randomCodeGenerator = () => {
    let code = getRandomInt(countryKeys.length);
    return countryKeys[`${code}`]
  };

  let countryCode = gameFlags[0];
  guessOptions.correctChoice = countryCode;
  gameFlags.shift();

  // store the random url 
  let flagUrl = (`https://flagcdn.com/${countryCode}.svg`);

  // Generate country options
  let countryOptions = [];
  countryOptions.push({ countryCode, country: countries[countryCode] });

  for (let i = 1; i < 4; i++) {
    let randomCountry = randomCodeGenerator();

    for (let option in countryOptions) {
      while (countryOptions[option].countryCode === randomCountry) {
        randomCountry = randomCodeGenerator();
      }
    }

    countryOptions.push({ countryCode: randomCountry, country: countries[randomCountry] });
  };

  return {
    flag: flagUrl,
    countries: shuffle(countryOptions)
  };

};

function checkAnswer() {

  if (guessOptions.choice === guessOptions.correctChoice) {
    if (user.difficulty === "standard") {
      // unlimited lives as long as you dont get two questions incorrect conssecutively
      if (user.lives === 1) user.lives = 2;
    }
    // More points rewarded for faster response times
    guessOptions.timeRemaining >= 5000 ? user.score += 60 :
      guessOptions.timeRemaining === 4000 ? user.score += 40 :
        guessOptions.timeRemaining === 3000 ? user.score += 30 : guessOptions.timeRemaining === 2000 ? user.score += 20 : user.score += 10;

    user.guessResults.correctFlags.push({ choice: guessOptions.choice, correctChoice: guessOptions.correctChoice });
    return gameBuild("correct");
  }
  // if user makes an incorrect guess then give 5 points
  if (guessOptions.timeRemaining) user.score += 5;

  user.lives--;
  user.guessResults.incorrectFlags.push({ choice: guessOptions.choice, correctChoice: guessOptions.correctChoice });


  if (user.lives === 0) return gameBuild("results", "Ran out of lives");
  return gameBuild("incorrect");
}

/**
 * Countdown from the variable set in the args
 */
const startCountdown = async (timeLimit) => {
  countdown = timeLimit;
  move(timeLimit);

  const timer = setInterval(() => {
    countdown = countdown - 1000;

    document.getElementById("user-info__countdown").innerText = `Countdown: ${countdown / 1000}`;

    if (countdown === 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

function gameBuild(results, string) {
  // if question limit reached end the game
  if ((user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length) === user.questionLimit) return gameBuild("results", "Question Limit Reached");

  if (results === "results") {
    document.querySelector(".fwf__display").classList.add("hide");
    document.querySelector(".user-info").classList.add("hide");

    document.querySelector(".fwf__gameover").classList.add("show");
    document.querySelector(".fwf__gameover-reason").innerText = string
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(user));

    return;
  };

  // Choice confirmation animation
  if (results === "correct") document.body.style.backgroundColor = "green";
  if (results === "incorrect") document.body.style.backgroundColor = "red";

  // reset game options
  guessOptions = { choice: null, correctChoice: null, timeRemaining: null };

  // timeout for animation between questions
  setTimeout(() => {
    document.body.style.backgroundColor = "#e5e5e5";
    buildUserInfo(user);
    buildGameContainer(showCountryFlag(apiResponseWithoutStates));
  }, 1000);
};

/*
 Defines the variables from API and saves to local storage
*/
const define = (data) => {
  localStorage.setItem("apiResponse", JSON.stringify(data));
  apiResponse = data;

  const filteredApiResponse = Object.entries(apiResponse).filter(code => !code[0].startsWith("us-"));

  apiResponseWithoutStates = filteredApiResponse.reduce((acc, curr) => {
    let key = curr[0], value = curr[1];
    acc[key] = value;
    return acc;
  }, {})

  gameFlags = shuffle(Object.keys(apiResponseWithoutStates));
};

const startGame = async () => {
  if (user.lives === 0) return gameBuild("results", "ran out of lives");
  if ((user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length) === user.questionLimit) return gameBuild("results", "Question Limit Reached");

  if (user.difficulty === "hard") user.lives = 3;

  await fetch('https://flagcdn.com/en/codes.json')
    .then(response => response.json())
    .then(data => define(data))
    .then(() => {
      buildUserInfo(user);
      buildGameContainer(showCountryFlag(apiResponseWithoutStates));
    })
}




startGame();
