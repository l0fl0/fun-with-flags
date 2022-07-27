import { createPageElement, shuffle, getRandomInt } from "../../utils/utils.js";
import { move } from "../../scripts/ProgressBarAnimation.js";

let apiResponse = {}, apiResponseWithoutStates = {}, gameFlags = [];
let user = JSON.parse(localStorage.getItem("user"));
let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
let timeLimit = 8000;
let guessOptions = {
  choice: "",
  correctChoice: ""
};

function buildUserInfo(user) {
  // User info 
  const username = document.querySelector(".user-info__username")
  username.innerText = `${user.name}`

  // const countdownTimer = document.querySelector(".user-info__countdown");
  // countdownTimer.innerText = `Countdown: ${timeLimit / 1000}`;
  move(timeLimit);
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
    while (countryCode === randomCountry) {
      randomCountry = randomCodeGenerator();
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
    user.score += 3;
    user.guessResults.correctFlags.push(guessOptions.correctChoice);
    return gameBuild();
  }

  user.lives--;
  user.guessResults.incorrectFlags.push(guessOptions.correctChoice);

  if (user.lives === 0) return gameBuild("results");
  return gameBuild();
}

/**
 * Countdown from the variable set in the args
 */
const startCountdown = async (timeLimit) => {
  const timer = setInterval(() => {
    timeLimit = timeLimit - 1000;

    // document.getElementById("user-info__countdown").innerText = `Countdown: ${timeLimit / 1000}`;
    if (timeLimit === 0) {
      clearInterval(timer);
      checkAnswer();

    }
  }, 1000);
}

function gameBuild(results) {
  if (results === "results") {
    document.querySelector(".fwf__display").classList.add("hide");
    document.querySelector(".user-info__progressbar").classList.add("hide");
    document.querySelector(".fwf__game-over").classList.add("show");

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(user));

    return;
  }
  buildGameContainer(showCountryFlag(apiResponseWithoutStates));
  buildUserInfo(user);
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
  if (user.difficulty === "hard") timeLimit = 4000;
  if (user.difficulty === "sheldon") timeLimit = 2000;

  await fetch('https://flagcdn.com/en/codes.json')
    .then(response => response.json())
    .then(data => define(data))
    .then(() => {
      gameBuild();
    })
}

startGame();
