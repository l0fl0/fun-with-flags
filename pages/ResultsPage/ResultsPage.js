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

    flagArray.forEach(option => {
      let rowContainer = createPageElement("a", "results__row");
      //   Flag url
      let flagUrl = (`https://flagcdn.com/${option.correctChoice}.svg`)
      let flagEl = createPageElement("img", "results__flag");
      flagEl.src = flagUrl;
      flagEl.alt = `${option.correctChoice} flag`;

      rowContainer.appendChild(flagEl);

      let countryName = createPageElement("span", "results__country", apiResponse[option.correctChoice]);

      let incorrectCountryName = createPageElement("span", "results__incorrect-country", apiResponse[option.choice]);

      rowContainer.href = `https://en.wikipedia.org/wiki/${countryName.innerText}`;
      rowContainer.target = "_blank";
      rowContainer.title = apiResponse[option.correctChoice];
      rowContainer.appendChild(countryName);
      if (trimKey === "incorrect") rowContainer.appendChild(incorrectCountryName)
      rowContainer.appendChild(flagEl);


      column.appendChild(rowContainer
      );
    })
    resultsContainer.appendChild(column);
  }
}


async function displayScoreboard() {
  let users = await JSON.parse(localStorage.getItem("users"));
  let sortedUsers = await users.sort((a, b) => b.score - a.score);
  localStorage.setItem("users", JSON.stringify(sortedUsers))

  let sufixes = (number) => {
    if (number > 10) return number;
    if (number === 1) return number + "st";
    if (number === 2) return number + "nd";
    if (number === 3) return number + "rd";
    return number + "th";
  };


  sortedUsers.forEach(user => {
    let row = createPageElement("div", "scoreboard__row");
    let rank = createPageElement("span", "scoreboard__rank", sufixes(sortedUsers.indexOf(user) + 1));
    let name = createPageElement("span", "scoreboard__name", user.name);
    let score = createPageElement("span", "scoreboard__score", user.score ? user.score : "0");

    row.appendChild(rank);
    row.appendChild(score);
    row.appendChild(name);

    document.querySelector(".scoreboard__difficulty-standard").appendChild(row);
  })
}

buildResults();
displayScoreboard();