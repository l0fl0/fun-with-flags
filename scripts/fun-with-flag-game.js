import { randomCodeGenerator, createPageElement, shuffle } from "../utils/utils.js";

const showCountryFlag = (countries) => {

  //TODO: us-state flags showing up... do we want them or not?

  countryCode = randomCodeGenerator();
  correctCountry = countries[countryCode];
  console.info(`This country is ${countries[countryCode]}`);


  // store the random url 
  let flagUrl = (`https://flagcdn.com/${countryCode}.svg`)

  // Generate country options
  let countryOptions = [];
  countryOptions.push(countries[countryCode]);

  for (let i = 1; i < 4; i++) {
    let randomCountry = randomCodeGenerator();
    if (countryCode != randomCountry) {
      countryOptions[i] = countries[randomCountry];
    }
  };


  let result = {
    flag: flagUrl,
    countries: shuffle(countryOptions),
  };

  return result;
};


const userInfoContainer = document.querySelector(".fwf-game__user-container")
function buildUserInfo(user) {

  // let user = JSON.parse(localStorage["user"]);
  // User info 
  const userName = createPageElement("div", "fwf-game__username", `User: ${user.name}`);
  userInfoContainer.appendChild(userName);

  // lives 
  const userLifeElement = createPageElement("div", "fwf-game__lives", `Lives: ${user.lives}`);
  userInfoContainer.appendChild(userLifeElement);

  // score 
  const userScore = createPageElement("div", "fwf-game__score", `Score: ${user.score}`);
  userInfoContainer.appendChild(userScore);
}

const gameContainer = document.querySelector(".fwf-game__display");


function buildGameContainer(data) {

  // Flag
  const flagContainer = createPageElement("div", "fwf-game__flag-container", null)
  gameContainer.appendChild(flagContainer);

  const flagEl = createPageElement("img", "fwf-game__flag", null);
  flagEl.setAttribute("src", data.flag);

  flagContainer.appendChild(flagEl);
  gameContainer.appendChild(flagContainer);

  // Country Options
  const countriesContainer = createPageElement("div", "fwf-game__countries-container", null);
  gameContainer.appendChild(countriesContainer);

  data.countries.forEach(country => {
    let countryOption = createPageElement("button", "fwf-game__country-option", country);
    countryOption.addEventListener("click", handleOptionSelect)
    countriesContainer.appendChild(countryOption);
  });

  function handleOptionSelect(event) {
    event.preventDefault();
    event.target.classList.add("fwf-game__country-option--active");

    if (event.target.textContent === correctCountry) {
      event.target.classList.add("fwf-game__country-option--correct");
      correctFlags.push(countryCode);
      user.score++;
      // console.log(correctFlags);
    }
    if (event.target.textContent !== correctCountry) {
      event.target.classList.add("fwf-game__country-option--error");
      incorrectFlags.push(countryCode);
      user.lives--;
      // console.log(incorrectFlags);
    };

    if (user.lives === 0) {
      // let livesContainer = document.querySelector(".fwf-game__lives-container")
      // // livesContainer.innerHTML = "";
      userInfoContainer.innerHTML = "";
      gameContainer.innerHTML = "";

      localStorage.setItem("correctFlags", JSON.stringify(correctFlags));
      localStorage.setItem("incorrectFlags", JSON.stringify(incorrectFlags));

      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      // console.log(users)
      let gameOverImage = createPageElement("img", "fwf-game__game-over", null);
      gameOverImage.src = "../assets/images/bazinga.png";
      gameOverImage.alt = "Game Over!";

      gameContainer.appendChild(gameOverImage);

      let viewResults = createPageElement("button", "fwf-game__button", "View Results");
      gameContainer.appendChild(viewResults)

      viewResults.addEventListener("click", () => {
        window.location.assign("../pages/results.html");
      })
      return;
    }
    // TODO: Allow for changing answer within time limit
    setTimeout(() => {
      let data = showCountryFlag(apiResponse);

      gameContainer.innerHTML = "";
      userInfoContainer.innerHTML = "";

      buildUserInfo(user)
      buildGameContainer(data);
    }, 1000)
  };
}

// Promise invocation
axios.get('https://flagcdn.com/en/codes.json')
  .then((response) => {
    define(response.data);
    return showCountryFlag(response.data);
  })
  .then(obj => {
    buildGameContainer(obj)
  })



