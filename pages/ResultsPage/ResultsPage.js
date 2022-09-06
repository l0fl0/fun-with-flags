import { createPageElement, playFile } from "../../scripts/utils.js";

const currentUser = JSON.parse(localStorage.getItem("user"));
// Audio api
// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function buildResults() {
	const apiResponse = JSON.parse(localStorage.getItem("apiResponse"));

	const results = document.querySelector(".results");
	const resultsContainer = createPageElement("div", "results__container");
	results.appendChild(resultsContainer);

	for (const key in currentUser.guessResults) {
		if (currentUser.guessResults[key].length === 0) {
			return;
		}

		const trimKey = key.replace("Flags", "");
		const column = createPageElement("div", "results__column");
		const title = createPageElement("h3", "results__column-title", trimKey);
		title.classList.add(`results__column-title--${trimKey}`);
		column.appendChild(title);

		const flagArray = currentUser.guessResults[key];

		flagArray.forEach((option) => {
			const rowContainer = createPageElement("a", "results__row");
			// Audio
			rowContainer.addEventListener("mousedown", () => new Audio("/assets/audio/click.wav").play());

			//   Flag url
			const flagUrl = `https://flagcdn.com/${option.correctChoice}.svg`;
			const flagEl = createPageElement("img", "results__flag");
			flagEl.src = flagUrl;
			flagEl.alt = `${option.correctChoice} flag`;

			rowContainer.appendChild(flagEl);

			const countryName = createPageElement("span", "results__country", apiResponse[option.correctChoice]);

			const incorrectCountryName = createPageElement("span", "results__incorrect-country", apiResponse[option.choice]);

			rowContainer.href = `javascript:setTimeout(function() {window.open("https://en.wikipedia.org/wiki/${countryName.innerText}", '_blank')},500)`;

			rowContainer.title = apiResponse[option.correctChoice];
			rowContainer.appendChild(countryName);
			if (trimKey === "incorrect") rowContainer.appendChild(incorrectCountryName);
			rowContainer.appendChild(flagEl);

			column.appendChild(rowContainer);
		});
		resultsContainer.appendChild(column);
	}
}

const users = JSON.parse(localStorage.getItem("users"));
const sortedUsers = users.sort((a, b) => b.score - a.score);

async function displayScoreboard() {
	localStorage.setItem("users", JSON.stringify(sortedUsers));

	for (let i = 0; i < 10; i++) {
		buildScoreRow(sortedUsers[i], ".scoreboard__difficulty-standard");
	}

	// User index in scoreboard
	const currentUserIndex = sortedUsers.findIndex((obj) => obj.id === currentUser.id);

	// display score under elipsis
	if (currentUserIndex > 9) buildScoreRow(sortedUsers[currentUserIndex], ".scoreboard__current-user-score");
}

function buildScoreRow(userObj, parent) {
	const sufixes = (number) => {
		if (number > 10) return number;
		if (number === 1) return number + "st";
		if (number === 2) return number + "nd";
		if (number === 3) return number + "rd";
		return number + "th";
	};

	const row = createPageElement("div", "scoreboard__row");
	if (userObj.id === currentUser.id) {
		row.classList.add("scoreboard__current-score");
		row.focus();
	}

	const rank = createPageElement("span", "scoreboard__rank", sufixes(sortedUsers.indexOf(userObj) + 1));
	const name = createPageElement("span", "scoreboard__name", userObj.name);
	const score = createPageElement("span", "scoreboard__score", userObj.score ? userObj.score : "0");

	row.appendChild(rank);
	row.appendChild(score);
	row.appendChild(name);

	document.querySelector(parent).appendChild(row);
}
// Slider
const slideButtons = document.querySelectorAll(".nav__slide");
for (const button of slideButtons) {
	button.addEventListener("click", handleNavSlide);
}
let slidePosition = 0;

function handleNavSlide(event) {
	playFile("/assets/audio/click.wav", audioCtx);

	const sections = [
		[document.querySelector(".results"), document.querySelector(".results__title")],
		[document.querySelector(".scoreboard"), document.querySelector(".scoreboard__title")],
	];

	if (slidePosition < 0) slidePosition = sections.length - 1;

	for (const section of sections) {
		for (const element of section) {
			element.classList.add("hide");
			element.classList.remove("show");
		}
	}

	for (const element of sections[slidePosition]) {
		element.classList.remove("hide");
		element.classList.add("show");
	}

	slidePosition = slidePosition - 1;
}

//view all scores
const viewAllScores = document.querySelector(".scoreboard__elipsis");
let showAllScores = true;

viewAllScores.addEventListener("click", () => {
	playFile("/assets/audio/click.wav", audioCtx);

	if (showAllScores) {
		showAllScores = false;
		for (let i = 10; i < sortedUsers.length; i++) {
			buildScoreRow(sortedUsers[i], ".scoreboard__difficulty-standard");
		}

		document.querySelector(".scoreboard__current-user-score").innerHTML = "";
		return;
	}

	showAllScores = true;
	document.querySelector(".scoreboard__difficulty-standard").innerHTML = "";
	displayScoreboard();
});

//play again sound
document.getElementById("playAgain").addEventListener("click", () => {
	playFile("/assets/audio/click.wav", audioCtx);
	setTimeout(() => window.location.assign("/index.html"), 350);
});

buildResults();
displayScoreboard();
