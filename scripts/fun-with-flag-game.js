let apiResponse = {};

let countryCodes = [];

let countryNames = [];

let countryCodesWithoutStates = [];

let correctCountry = "";

let indexOfStates = [];

function define(data) {
  // returns all keys in the object as an array
  countryCodes = Object.keys(data);
  //returns all values in object as an array
  countryNames = Object.values(data);

  countryCodesWithoutStates = countryCodes.slice().filter(
    (code, i) => {
      !(code.startsWith("us-"))
      indexOfStates.push(i)
    });



  console.log(countryCodesWithoutStates)

  apiResponse = data;

};



const showCountryFlag = (countries) => {

  // Generates Random Counrty code from counrtyCodes Array
  const randomCodeGenerator = () => {
    // random integer generator
    const getRandomInt = (maxnumber) => {
      maxnumber = countryCodes.length;
      return Math.floor(Math.random() * (maxnumber - 1))
    };
    // assigns random index to pull form array
    let randomCode = countryCodes[getRandomInt()];
    return randomCode;
  };

  //TODO: us-state flags showing up... do we want them or not?

  let countryCode = randomCodeGenerator();
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

  // Fisher-Yates SHUFFLE ALGORITM https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  let result = {
    flag: flagUrl,
    countries: shuffle(countryOptions),
  };

  return result;
};


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
    if (event.target.textContent === correctCountry) {
      event.target.classList.add("fwf-game__country-option--correct");

    } else {
      event.target.classList.add("fwf-game__country-option--error");

    };

    let data = showCountryFlag(apiResponse);

    setTimeout(() => {
      gameContainer.innerHTML = "";
      buildGameContainer(data);
    }, 2000)
  };
}

// Promise invocation
axios.get('https://flagcdn.com/en/codes.json')
  .then((response) => {
    return response.data;
  })
  .then(data => {
    define(data);
    console.log(data);
    return showCountryFlag(data);
  })
  .then(obj => {
    // Flag container div to store random flag

    buildGameContainer(obj)

  })



