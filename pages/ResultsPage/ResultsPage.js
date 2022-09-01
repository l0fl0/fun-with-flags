import { createPageElement } from "../../scripts/utils.js";

let currentUser = await JSON.parse(localStorage.getItem("user"));

async function buildResults() {
	let apiResponse = await JSON.parse(localStorage.getItem("apiResponse"));

	let results = document.querySelector(".results");
	let resultsContainer = createPageElement("div", "results__container");
	results.appendChild(resultsContainer);

	for (let key in currentUser.guessResults) {
		if (currentUser.guessResults[key].length === 0) {
			return;
		}

		const trimKey = key.replace("Flags", "");
		let column = createPageElement("div", "results__column");
		let title = createPageElement("h3", "results__column-title", trimKey);
		title.classList.add(`results__column-title--${trimKey}`);
		column.appendChild(title);

		let flagArray = currentUser.guessResults[key];

		flagArray.forEach((option) => {
			let rowContainer = createPageElement("a", "results__row");
			// Audio
			rowContainer.addEventListener("mousedown", () =>
				new Audio("/assets/audio/click.wav").play()
			);

			//   Flag url
			let flagUrl = `https://flagcdn.com/${option.correctChoice}.svg`;
			let flagEl = createPageElement("img", "results__flag");
			flagEl.src = flagUrl;
			flagEl.alt = `${option.correctChoice} flag`;

			rowContainer.appendChild(flagEl);

			let countryName = createPageElement(
				"span",
				"results__country",
				apiResponse[option.correctChoice]
			);

			let incorrectCountryName = createPageElement(
				"span",
				"results__incorrect-country",
				apiResponse[option.choice]
			);

			rowContainer.href = `javascript:setTimeout(function() {window.open("https://en.wikipedia.org/wiki/${countryName.innerText}", '_blank')},500)`;

			rowContainer.title = apiResponse[option.correctChoice];
			rowContainer.appendChild(countryName);
			if (trimKey === "incorrect")
				rowContainer.appendChild(incorrectCountryName);
			rowContainer.appendChild(flagEl);

			column.appendChild(rowContainer);
		});
		resultsContainer.appendChild(column);
	}
}

async function displayScoreboard() {
	let users = await JSON.parse(localStorage.getItem("users"));
	let sortedUsers = await users.sort((a, b) => b.score - a.score);
	localStorage.setItem("users", JSON.stringify(sortedUsers));

	let sufixes = (number) => {
		if (number > 10) return number;
		if (number === 1) return number + "st";
		if (number === 2) return number + "nd";
		if (number === 3) return number + "rd";
		return number + "th";
	};

	for (let i = 0; i < 10; i++) {
		let row = createPageElement("div", "scoreboard__row");
		if (sortedUsers[i].id === currentUser.id) {
			row.classList.add("scoreboard__current-score");
			row.focus();
		}

		let rank = createPageElement(
			"span",
			"scoreboard__rank",
			sufixes(sortedUsers.indexOf(sortedUsers[i]) + 1)
		);

		let name = createPageElement(
			"span",
			"scoreboard__name",
			sortedUsers[i].name
		);

		let score = createPageElement(
			"span",
			"scoreboard__score",
			sortedUsers[i].score ? sortedUsers[i].score : "0"
		);

		row.appendChild(rank);
		row.appendChild(score);
		row.appendChild(name);

		document.querySelector(".scoreboard__difficulty-standard").appendChild(row);
	}
}
//play again sound
document.getElementById("playAgain").addEventListener("click", () => {
	new Audio("/assets/audio/stavsounds__correct3.wav").play();
	setTimeout(() => window.location.assign("/index.html"), 1000);
});

let slideButtons = document.querySelectorAll(".nav__slide");
for (let button of slideButtons) {
	button.addEventListener("click", handleNavSlide);
}
let position = 0;

function handleNavSlide(event) {
	new Audio("/assets/audio/click.wav").play();

	const sections = [
		[
			document.querySelector(".results"),
			document.querySelector(".results__title"),
		],
		[
			document.querySelector(".scoreboard"),
			document.querySelector(".scoreboard__title"),
		],
	];

	if (position < 0) position = sections.length - 1;

	for (let section of sections) {
		for (let element of section) {
			element.classList.add("hide");
			element.classList.remove("show");
		}
	}

	for (let element of sections[position]) {
		element.classList.remove("hide");
		element.classList.add("show");
	}
	position = position - 1;

	if ((event.target.id = "leftSide")) {
	}
}

// on loading screen
new Audio("/assets/audio/stavsounds__correct3.wav").play();

buildResults();
displayScoreboard();
