let apiResponse = {};
let countryCodes = [];
let countryNames = [];
let countryCodesWithoutStates = [];
let correctCountry = "";
let indexOfStates = [];
let incorrectFlags = [];
let correctFlags = [];
let countryCode = "";
let timeLimit = 10000;
let timerCountdown = 0;
let users = [];
let user = {
  name: "",
  score: 0,
  lives: 5
};

// check to see if storage exists and then set user obj to local storage
if (JSON.parse(localStorage.getItem("users"))) users = JSON.parse(localStorage.getItem("users"));

