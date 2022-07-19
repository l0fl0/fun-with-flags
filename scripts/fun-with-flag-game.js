import { createPageElement, shuffle, getRandomInt } from "../utils/utils.js";

let apiResponse = {}, apiResponseWithoutStates = {};
let user = JSON.parse(localStorage.getItem("user"));
let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
let timeLimit = 8000, timerCountdown = 0;
let guessOptions = {
  choice: "",
  correctChoice: ""
};

function buildUserInfo(user) {
  // User info 
  const username = document.querySelector(".user-info__username")
  username.innerText = `Player: ${user.name}`

  const countdownTimer = document.querySelector(".user-info__countdown");
  countdownTimer.innerText = `Countdown: ${timeLimit / 1000}`;
  startCountdown(timeLimit);
};

function buildGameContainer(data) {
  const flagContainer = document.querySelector(".fwf__flag-container");
  const options = document.querySelector(".fwf__options");

  flagContainer.innerHTML = "";
  options.innerHTML = "";

  console.log(data)
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
  let guessOptions = {
    choice: "",
    correctChoice: ""
  };
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
  /**
 * Returns Random Country code from counrtyCodes Array
 */
  const randomCodeGenerator = () => {
    let flags = Object.keys(apiResponseWithoutStates);
    let code = getRandomInt(flags.length);

    return flags[code];
  };

  let countryCode = randomCodeGenerator();
  guessOptions.correctChoice = countryCode;
  // console.info(`This country is ${countries[countryCode]}`);

  // store the random url 
  let flagUrl = (`https://flagcdn.com/${countryCode}.svg`)

  // Generate country options
  let countryOptions = [];
  countryOptions.push({ countryCode, country: countries[countryCode] });

  for (let i = 1; i < 4; i++) {
    let randomCountry = randomCodeGenerator();
    if (countryCode != randomCountry) {
      countryOptions[i] = { countryCode: randomCountry, country: countries[randomCountry] };
    }
  };


  let result = {
    flag: flagUrl,
    countries: shuffle(countryOptions),
  };

  return result;
};

function checkAnswer() {
  if (user.lives === 0) {
    gameContainer.innerHTML = "";

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    let gameOver = document.querySelector(".fwf__game-over");
    gameOver.classList.add(".show");

    let viewResults = createPageElement("button", "fwf__button", "View Results");
    gameContainer.appendChild(viewResults)

    viewResults.addEventListener("click", () => {
      window.location.assign("../pages/results.html");
    })
    return;
  }
  if (guessOptions.choice === guessOptions.correctChoice) {
    user.score++;
    user.guessResults.correctFlags.push(guessOptions.correctChoice);
    return;
  }
  user.lives--;
  user.guessResults.incorrectFlags.push(guessOptions.correctChoice);
}

/**
 * Countdown from the variable set in the args
 */
const startCountdown = (timeLimit) => {
  timerCountdown = timeLimit;
  const timer = setInterval(() => {
    timerCountdown = timerCountdown - 1000;

    document.getElementById("user-info__countdown").innerText = `Countdown: ${timerCountdown / 1000}`;

    if (timerCountdown === 0) {
      checkAnswer();
      gameBuild();
      clearInterval(timer);
    }
  }, 1000);

  if (user.lives === 0) {
    gameContainer.innerHTML = "";

    users.push(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("users", JSON.stringify(users));

    let gameOverImage = document.querySelector(".fwf__game-over");
    gameOverImage.classList.add(".show");

    let viewResults = createPageElement("button", "fwf__button", "View Results");
    gameContainer.appendChild(viewResults);

    viewResults.addEventListener("click", () => {
      window.location.assign("../pages/results.html");
    });

    clearInterval(timer);
    return;
  }
}

function gameBuild() {
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

  apiResponseWithoutStates = filteredApiResponse.slice().reduce((acc, curr) => {
    let key = curr[0], value = curr[1];
    acc[key] = value;
    return acc;
  }, {})
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
