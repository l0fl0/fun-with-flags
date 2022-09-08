import { shuffle } from "../../scripts/utils.js";
import { createPageElement, playFile, getRandomInt } from "../../scripts/utils.js";

let user = localStorage.getItem("user")
	? JSON.parse(localStorage.getItem("user"))
	: {
			id: null,
			name: "",
			score: 0,
			lives: 2,
			difficulty: "standard",
			questionLimit: 30,
			guessResults: {
				incorrectFlags: [],
				correctFlags: [],
			},
	  };

// Audio api
// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext,
	audioCtx = new AudioContext();

const formEl = document.querySelector(".registration-form");
formEl.addEventListener("keydown", handleKeypress);
formEl.addEventListener("submit", handleSubmit);

// handle enter for mobile enter does not start game
function handleKeypress(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		playFile("/assets/audio/keypress.wav", audioCtx);
		const index = [...formEl].indexOf(e.target);
		formEl.elements[index + 1].focus();
		return false;
	}
}

// Form submit handler
function handleSubmit(event) {
	event.preventDefault();
	playFile("/assets/audio/stavsounds__correct3.wav", audioCtx);

	// Store registration information
	user.id = crypto.randomUUID
		? crypto.randomUUID()
		: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

	user.name = event.target.username.value;
	user.difficulty = event.target.difficulty.value;
	user.questionLimit = Number(event.target.questionLimit.value);
	user.score = 0;
	user.guessResults = {
		incorrectFlags: [],
		correctFlags: [],
	};

	if (user.difficulty === "hard") user.lives = 3;
	else user.lives = 2;

	localStorage.setItem("user", JSON.stringify(user));

	setTimeout(() => window.location.assign("/pages/FWFGame/index.html"), 1000);
}

// Username
const usernameInput = document.querySelector("#username");
usernameInput.value = user.name;
usernameInput.addEventListener("input", () => playFile("/assets/audio/keypress.wav", audioCtx));
usernameInput.addEventListener("click", () => playFile("/assets/audio/click.wav", audioCtx));

// Difficutly Option
const difficultyOptions = document.querySelectorAll(".registration-form__difficulty-option");
difficultyOptions.forEach((el) => {
	if (el.value === user.difficulty) {
		el.labels[0].classList.add("registration-form__difficulty-label--active");
		el.setAttribute("checked", "true");
	}

	el.addEventListener("click", activeDifficulty);
});

function activeDifficulty(event) {
	playFile("/assets/audio/click.wav", audioCtx);

	difficultyOptions.forEach((el) => {
		el.labels[0].classList.remove("registration-form__difficulty-label--active");
		el.setAttribute("checked", "false");
	});
	event.target.setAttribute("checked", "true");
	event.target.labels[0].classList.add("registration-form__difficulty-label--active");
}

// Question Limit Option
const limitOptions = document.querySelectorAll(".registration-form__limit-option");
limitOptions.forEach((el) => {
	if (el.value == user.questionLimit) {
		el.labels[0].classList.add("registration-form__limit-label--active");
		el.setAttribute("checked", "true");
	}

	el.addEventListener("click", activeLimit);
});

function activeLimit(event) {
	playFile("/assets/audio/click.wav", audioCtx);

	limitOptions.forEach((el) => {
		el.labels[0].classList.remove("registration-form__limit-label--active");
		el.setAttribute("checked", "false");
	});
	event.target.setAttribute("checked", "true");
	event.target.labels[0].classList.add("registration-form__limit-label--active");
}

/*
 Defines the variables from API and saves to local storage
*/
const define = (data) => {
	const filteredApiResponse = Object.entries(data).filter((code) => !code[0].startsWith("us-"));

	sessionStorage.setItem(
		"filteredApiResponse",
		JSON.stringify(
			filteredApiResponse.reduce((acc, curr) => {
				let key = curr[0],
					value = curr[1];
				acc[key] = value;
				return acc;
			}, {})
		)
	);

	const strippedResponse = Object.keys(JSON.parse(sessionStorage.getItem("filteredApiResponse"))),
		gameCodes = JSON.stringify(shuffle(strippedResponse.map((correctCode) => options(correctCode))));

	sessionStorage.setItem("gameCodes", gameCodes);

	function options(correctCode) {
		let countryOptions = [correctCode];

		const randomCodeGenerator = () => {
			const code = getRandomInt(strippedResponse.length);
			return strippedResponse[`${code}`];
		};

		for (let i = 0; i < 3; i++) {
			let randomCountry = randomCodeGenerator();

			for (let option in countryOptions) {
				while (countryOptions[option].correctCode === randomCountry) {
					randomCountry = randomCodeGenerator();
				}
			}
			countryOptions.push(randomCountry);
		}
		return countryOptions;
	}
	backgroundFlags([
		...JSON.parse(sessionStorage.getItem("gameCodes"))[0],
		...JSON.parse(sessionStorage.getItem("gameCodes"))[1],
	]);
};

const flagData = async () => {
	if (!localStorage.getItem("apiResponse")) {
		await fetch("https://flagcdn.com/en/codes.json")
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("apiResponse", JSON.stringify(data));
				define(data);
			});
	} else define(JSON.parse(localStorage.getItem("apiResponse")));
};

// instigate audio
console.clear();
// call to api
flagData();

// helper functions
function backgroundFlags(flagCodeArray) {
	const backgroundEL = document.querySelector(".background__container");

	//TODO: Create recursive function and add a delay for each call

	for (let countryCode of flagCodeArray) {
		if (backgroundEL.clientHeight === window.innerHeight) break;
		let flag = createPageElement("img", "background__image");
		flag.setAttribute("src", `https://flagcdn.com/${countryCode}.svg`);

		backgroundEL.appendChild(flag);
	}
}
