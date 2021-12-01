
function buildResults() {
  let results = document.querySelector(".results");
  let resultsContainer = createPageElement("div", "results__container", null);

  results.appendChild(resultsContainer);

  let correctContainer = createPageElement("div", "results__column", null);

  let options = ["correct", "incorrect"];

  let correctFlags = JSON.parse(localStorage["correctFlags"]);
  let incorrectFlags = JSON.parse(localStorage["incorrectFlags"]);
  let apiResponse = JSON.parse(localStorage["apiResponse"]);

  let flagArray = []

  options.forEach(option => {
    let title = createPageElement("h3", "results__column-title", option);
    title.classList.add(`results__column-title--${option}`);
    correctContainer.appendChild(title);

    if (option === "correct") {
      let flagArray = correctFlags;
    } else {
      let flagArray = incorrectFlags;
    }

    flagArray.forEach(countryCode => {
      let rowContainer = createPageElement("div", "results__row", null);
      //   Flag url
      let flagUrl = (`https://flagcdn.com/${countryCode}.svg`)
      let flagEl = createPageElement("img", "results__flag", null);
      flagEl.src = flagUrl;
      flagEl.alt = `${countryCode} flag`;

      rowContainer.appendChild(flagEl);

      let countryName = createPageElement("span", "results__country", apiResponse[countryCode]);

      rowContainer.appendChild(countryName);
      correctContainer.appendChild(rowContainer);
    })
  })


  resultsContainer.appendChild(correctContainer);
}
buildResults();
// console.log(JSON.parse(localStorage["countryCodes"]));

// https://en.wikipedia.org/wiki/France