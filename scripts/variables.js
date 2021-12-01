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


let users = [
  {
    name: "Louis",
    score: 1,
    lives: 5
  },
  {
    name: "Mikes friend",
    score: 35,
    lives: 5
  },
  {
    name: "Sheldon",
    score: 36,
    lives: 5
  },
  {
    name: "Madhura",
    score: 25,
    lives: 5
  }
];





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