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

let countryCode = "";


let user = {
  name: "",
  score: 0,
  lives: 5
};

/*
local storage of previos single games
*/
let users = [];
// check to see if storage exists and then set user obj to local storage
if (JSON.parse(localStorage.getItem("users"))) users = JSON.parse(localStorage.getItem("users"));

/*
 Defines the variables from API and saves to local storage
*/
const define = (data) => {

  localStorage.setItem("countryCodes", JSON.stringify(Object.keys(data)))
  localStorage.setItem("countryNames", JSON.stringify(Object.values(data)));

  countryCodes = JSON.parse(localStorage["countryCodes"]);

  countryCodesWithoutStates = countryCodes.slice().filter(
    (code, i) => {
      !(code.startsWith("us-"))
      indexOfStates.push(i)
    });

  localStorage.setItem("apiResponse", JSON.stringify(data));

  apiResponse = JSON.parse(localStorage["apiResponse"]);
};