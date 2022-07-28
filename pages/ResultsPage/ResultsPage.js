import { createPageElement } from "../../utils/utils.js";


async function buildResults() {
  let user = await JSON.parse(localStorage.getItem("user"));
  let apiResponse = await JSON.parse(localStorage.getItem("apiResponse"));

  let results = document.querySelector(".results");
  let resultsContainer = createPageElement("div", "results__container");
  results.appendChild(resultsContainer);

  for (let key in user.guessResults) {
    if (user.guessResults[key].length === 0) {
      return;
    }

    const trimKey = key.replace("Flags", "");
    let column = createPageElement("div", "results__column");
    let title = createPageElement("h3", "results__column-title", trimKey);
    title.classList.add(`results__column-title--${trimKey}`);
    column.appendChild(title);

    let flagArray = user.guessResults[key];

    flagArray.forEach(countryCode => {
      let rowContainer = createPageElement("a", "results__row");
      //   Flag url
      let flagUrl = (`https://flagcdn.com/${countryCode}.svg`)
      let flagEl = createPageElement("img", "results__flag");
      flagEl.src = flagUrl;
      flagEl.alt = `${countryCode} flag`;

      rowContainer.appendChild(flagEl);

      let countryName = createPageElement("span", "results__country", apiResponse[countryCode]);

      rowContainer.href = `https://en.wikipedia.org/wiki/${countryName.innerText}`;
      rowContainer.target = "_blank";
      rowContainer.title = apiResponse[countryCode];
      rowContainer.appendChild(countryName)
      rowContainer.appendChild(flagEl);
      column.appendChild(rowContainer);
    })
    resultsContainer.appendChild(column);
  }
}


async function displayScoreboard() {
  let users = await JSON.parse(localStorage.getItem("users"));
  let sortedUsers = await users.sort((a, b) => a.score < b.score);

  sortedUsers.forEach(user => {
    let row = createPageElement("div", "scoreboard__row");
    let name = createPageElement("span", "scoreboard__name", user.name);
    let score = createPageElement("span", "scoreboard__score", user.score ? user.score : "0");

    row.appendChild(name);
    row.appendChild(score);
    document.querySelector(`.scoreboard__${user.difficulty}-difficulty`).appendChild(row);
  })
}

buildResults();
displayScoreboard();