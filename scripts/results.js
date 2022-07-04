import { createPageElement } from "../utils/utils.js";

function buildResults() {
  let results = document.querySelector(".results");
  let resultsContainer = createPageElement("div", "results__container", null);

  results.appendChild(resultsContainer);

  let options = ["correct", "incorrect"];

  let correctFlags = JSON.parse(localStorage["correctFlags"]);
  let incorrectFlags = JSON.parse(localStorage["incorrectFlags"]);
  let apiResponse = JSON.parse(localStorage["apiResponse"]);

  let flagArray = [];

  options.forEach(option => {
    let column = createPageElement("div", "results__column", null);
    let title = createPageElement("h3", "results__column-title", option);
    title.classList.add(`results__column-title--${option}`);
    column.appendChild(title);

    if (option === "correct") {
      flagArray = correctFlags;
    } else {
      flagArray = incorrectFlags;
    }

    flagArray.forEach(countryCode => {
      let rowContainer = createPageElement("a", "results__row", null);
      //   Flag url
      let flagUrl = (`https://flagcdn.com/${countryCode}.svg`)
      let flagEl = createPageElement("img", "results__flag", null);
      flagEl.src = flagUrl;
      flagEl.alt = `${countryCode} flag`;

      rowContainer.appendChild(flagEl);

      // let link = createPageElement("a", "results__country-link", null);

      let countryName = createPageElement("span", "results__country", apiResponse[countryCode]);

      rowContainer.href = `https://en.wikipedia.org/wiki/${countryName.innerText}`;
      rowContainer.target = "_blank";
      rowContainer.appendChild(countryName)
      rowContainer.appendChild(flagEl);
      column.appendChild(rowContainer);
    })
    resultsContainer.appendChild(column);
  })
}

function displayScoreboard() {
  let users = JSON.parse(localStorage["users"]);

  console.log(users);

  let scoreboard = document.querySelector(".scoreboard");

  let title = createPageElement("h2", "scoreboard__title", "Scoreboard");
  scoreboard.appendChild(title);

  let scoreboardContainer = createPageElement("div", "scoreboard__container", null);

  scoreboard.appendChild(scoreboardContainer);


  let sortedUsers = users.sort((a, b) => { a.score < b.score });
  console.log(users.sort((a, b) => a.score < b.score));


  sortedUsers.forEach(user => {
    let row = createPageElement("div", "scoreboard__row", null);
    let name = createPageElement("span", "scoreboard__name", user.name);

    let score = createPageElement("span", "scoreboard__score", user.score ? user.score : "0");
    row.appendChild(name);
    row.appendChild(score);
    scoreboardContainer.appendChild(row);
  })
}

buildResults();
displayScoreboard();