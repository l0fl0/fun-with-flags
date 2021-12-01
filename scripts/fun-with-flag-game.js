
let countryCodes = [];
let countryNames = [];

const showCountryFlag = (countries) => {

  // returns all keys in the object as an array
  countryCodes = Object.keys(countries);

  //returns all values in object as an array
  countryNames = Object.values(countries);

  // random integer generator
  const getRandomInt = (maxnumber) => {
    maxnumber = countryCodes.length;
    return Math.floor(Math.random() * (maxnumber))
  };

  randomCode = countryCodes[getRandomInt()];

  // for (let countryCode in countries) {
  //   // returns country code (i.e. "az")
  //   console.log(countryCode);

  //   // returns country name
  //   console.log(countries[countryCode])
  // }


};





axios.get('https://flagcdn.com/en/codes.json')
  .then((response) => {
    return response.data;
  })
  .then(data => {
    //about 306 different countries
    showCountryFlag(data)
  })
  ;















// axios.get('https://flagcdn.com/za.svg')
//   .then((response) => {
//     console.log(response)
//   })