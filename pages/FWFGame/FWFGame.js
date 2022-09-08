import { createPageElement, shuffle, getRandomInt, playFile } from "../../scripts/utils.js";
import { move } from "../../scripts/ProgressBarAnimation.js";

let apiResponse = JSON.parse(localStorage.getItem("apiResoponse")),
	apiResponseWithoutStates = JSON.parse(sessionStorage.getItem("apiResponseWithoutStates")),
	gameFlags = JSON.parse(sessionStorage.getItem("gameFlags")),
	user = JSON.parse(localStorage.getItem("user")),
	users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

let timeLimit = 6000,
	countdown = 0;

let guessOptions = {
	choice: null,
	correctChoice: null,
	timeRemaining: null,
};

// Audio api
// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function buildUserInfo(user) {
	// User info
	const username = document.querySelector(".user-info__username");
	username.innerText = `${user.name}`;

	const currentscore = document.querySelector(".user-info__currentscore");
	currentscore.innerText = `${user.score}`;

	let currentQuestion = user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length + 1;

	const questionTotal = document.querySelector(".user-info__question-total");
	questionTotal.innerText = `${currentQuestion}/${user.questionLimit}`;
}

function buildGameContainer(data) {
	const flagContainer = document.querySelector(".trivia__flag-container");
	const options = document.querySelector(".trivia__options");

	flagContainer.innerHTML = "";
	options.innerHTML = "";

	// Flag
	const flagEl = createPageElement("img", "trivia__flag");
	flagEl.setAttribute("src", data.flag);
	flagContainer.appendChild(flagEl);

	// Country Options
	data.countries.forEach((countryOption) => {
		let countryOptionBtn = createPageElement("li", "trivia__country-option", countryOption.country);
		countryOptionBtn.addEventListener("click", handleOptionSelect);
		countryOptionBtn.setAttribute("cc", countryOption.countryCode);

		options.appendChild(countryOptionBtn);
	});

	startCountdown(timeLimit);
}

function handleOptionSelect(event) {
	event.preventDefault();
	//set variable for time remaining if choice is selected
	guessOptions.timeRemaining = countdown;

	playFile("/assets/audio/click.wav", audioCtx);

	//remove active choice css
	if (document.querySelector(".trivia__country-option--active")) {
		document.querySelector(".trivia__country-option--active").classList.remove("trivia__country-option--active");
	}
	//add active choice css
	event.target.classList.add("trivia__country-option--active");
	//kep track of answer choice
	guessOptions.choice = event.target.attributes.cc.value;
}

function showCountryFlag(countries) {
	const countryKeys = Object.keys(countries);

	/**
	 * Returns Random Country code from counrtyCodes Array
	 */
	const randomCodeGenerator = () => {
		const code = getRandomInt(countryKeys.length);
		return countryKeys[`${code}`];
	};

	const questionNumber = user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length;
	const countryCode = gameFlags[questionNumber];
	guessOptions.correctChoice = countryCode;

	// store the random url
	let flagUrl = `https://flagcdn.com/${countryCode}.svg`;

	// Generate country options
	let countryOptions = [];
	countryOptions.push({ countryCode, country: countries[countryCode] });

	for (let i = 0; i < 3; i++) {
		let randomCountry = randomCodeGenerator();

		for (let option in countryOptions) {
			while (countryOptions[option].countryCode === randomCountry) {
				randomCountry = randomCodeGenerator();
			}
		}

		countryOptions.push({
			countryCode: randomCountry,
			country: countries[randomCountry],
		});
	}

	return {
		flag: flagUrl,
		countries: shuffle(countryOptions),
	};
}

function checkAnswer() {
	const options = document.querySelectorAll(".trivia__country-option");
	// Dont allow clicking of a new answer after time
	for (const option of options) {
		option.removeEventListener("click", handleOptionSelect);
	}

	let resultsObject = {
		points: 0,
		correctChoice: guessOptions.correctChoice,
	};

	const questionNumber = user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length + 1;

	// For correct response
	if (guessOptions.choice === guessOptions.correctChoice) {
		if (user.difficulty === "standard" && user.lives === 1) {
			// unlimited lives as long as you dont get two questions incorrect conssecutively
			user.lives = 2;
		}

		// More points rewarded for faster response times
		if (guessOptions.timeRemaining >= 5000) {
			user.score += 30;
			resultsObject.points = 30;
		}
		if (guessOptions.timeRemaining === 4000 || guessOptions.timeRemaining === 3000) {
			user.score += 27;
			resultsObject.points = 27;
		}
		if (guessOptions.timeRemaining <= 2000) {
			user.score += 24;
			resultsObject.points = 24;
		}

		user.guessResults.correctFlags.push(resultsObject);

		document.querySelector(".trivia__country-option--active").style.backgroundColor = "#6cbc3d";
		document.querySelector(".trivia__country-option--active").style.boxShadow = " 4px 4px 0px 2px #6cbc3d";

		// play audio for correct response
		playFile("/assets/audio/bertrof__game-sound-correct.wav", audioCtx);

		if (questionNumber === user.questionLimit) return gameBuild("limit", "Question Limit Reached");

		return gameBuild();
	}

	// if user makes an incorrect guess then give points
	if (guessOptions.timeRemaining) {
		user.score += 9;
		resultsObject.points = 9;
		document.querySelector(".trivia__country-option--active").style.backgroundColor = "#e2482d";
		document.querySelector(".trivia__country-option--active").style.boxShadow = " 4px 4px 0px 2px #e2482d";
	}

	// play audio for incorrect response
	playFile("/assets/audio/bertrof__game-sound-incorrect-with-delay.wav", audioCtx);

	// subtract lives and store result
	user.lives--;

	resultsObject.choice = guessOptions.choice;
	user.guessResults.incorrectFlags.push(resultsObject);

	if (questionNumber === user.questionLimit) return gameBuild("limit", "Question Limit Reached");

	if (user.lives === 0) return gameBuild("lives", "You ran out of lives");

	return gameBuild();
}

/**
 * Countdown from the variable set in the args
 */
function startCountdown(timeLimit) {
	countdown = timeLimit;
	move(timeLimit);

	const timer = setInterval(() => {
		countdown = countdown - 1000;

		if (countdown === 0) {
			clearInterval(timer);
			checkAnswer();
		}
	}, 1000);
}

function gameBuild(results, string) {
	// timeout for animation between questions
	setTimeout(() => {
		if (results) {
			document.querySelector(".fwf__display").classList.add("hide");
			document.querySelector(".gameover").classList.add("show");
			document.querySelector(".gameover__reason").innerText = string;

			users.push(user);
			localStorage.setItem("users", JSON.stringify(users));
			localStorage.setItem("user", JSON.stringify(user));

			if (results === "limit") {
				playFile("/assets/audio/bertrof__game-sound-correct.wav", audioCtx);
				document.querySelector(".gameover__reason").style.color = "#6cbc3d";
			}
			if (results === "lives") playFile("/assets/audio/themusicalnomad__negative-beeps.wav", audioCtx);

			return;
		}

		// reset game options
		guessOptions = { choice: null, correctChoice: null, timeRemaining: null };

		buildUserInfo(user);
		buildGameContainer(showCountryFlag(apiResponseWithoutStates));
	}, 1000);
}

function startGame() {
	buildUserInfo(user);
	buildGameContainer(showCountryFlag(apiResponseWithoutStates));
}

startGame();

document.querySelector(".fwf__results-button").addEventListener("click", () => {
	playFile("/assets/audio/click.wav", audioCtx);
	setTimeout(() => window.location.assign("../ResultsPage/index.html"), 350);
});
