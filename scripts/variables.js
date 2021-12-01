let apiResponse = {};

let countryCodes = [];

let countryNames = [];

let countryCodesWithoutStates = [];

let correctCountry = "";

let indexOfStates = [];

// return an array of counrty codes
let incorrectFlags = [];

// return an array of counrty codes
let correctFlags = [];

let userLives = 5;

let countryCode = "";



const define = (data) => {
  // returns all keys in the object as an array
  localStorage.setItem("countryCodes", JSON.stringify(Object.keys(data)))
  //returns all values in object as an array
  localStorage.setItem("countryNames", JSON.stringify(Object.values(data)));

  countryCodes = JSON.parse(localStorage["countryCodes"]);

  countryCodesWithoutStates = countryCodes.slice().filter(
    (code, i) => {
      !(code.startsWith("us-"))
      indexOfStates.push(i)
    });



  // console.log(countryCodesWithoutStates);
  localStorage.setItem("apiResponse", JSON.stringify(data));

  apiResponse = JSON.parse(localStorage["apiResponse"]);
  // apiResponse = data;

};