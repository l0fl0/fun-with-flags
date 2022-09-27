import { createPageElement, shuffle, playFile } from "../../scripts/utils.js";
import { move } from "../../scripts/ProgressBarAnimation.js";

let filteredApiResponse = JSON.parse(sessionStorage.getItem("filteredApiResponse")),
	gameCodes = JSON.parse(sessionStorage.getItem("gameCodes")),
	user = JSON.parse(localStorage.getItem("user")),
	users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

let timeLimit = 6000,
	countdown = 0;

let guessOptions = {
	choice: null,
	correctChoice: null,
	timeRemaining: null,
};

/** Returns the current question index position */
function questionIndex() {
	return user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length;
}

// Audio api
// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext,
	audioCtx = new AudioContext();

function buildUserInfo(user) {
	// User info
	const username = document.querySelector(".user-info__username");
	if (!username.innerText) username.innerText = `${user.name}`;

	const currentscore = document.querySelector(".user-info__currentscore");
	if (Number(currentscore.innerText) !== user.score) currentscore.innerText = `${user.score}`;

	const questionTotal = document.querySelector(".user-info__question-total");
	questionTotal.innerText = `${questionIndex() + 1}/${gameCodes.length}`;
}

function buildGameContainer(data) {
	const triviaQuestion = createPageElement("article", "trivia__question"),
		flagContainer = createPageElement("div", "trivia__flag-container"),
		options = createPageElement("ul", "trivia__options"),
		progressBar = createPageElement("div", "progressbar"),
		barStatus = createPageElement("div", "progressbar__barstatus");

	// Progressbar
	barStatus.setAttribute("id", `barStatus${questionIndex()}`);
	progressBar.appendChild(barStatus);

	// Flag
	const flagEl = createPageElement("img", "trivia__flag");
	flagEl.setAttribute("src", data.flag);
	flagContainer.appendChild(flagEl);

	// Country Options
	data.countries.forEach((countryOption) => {
		let countryOptionBtn = createPageElement("li", "trivia__country-option", countryOption.country);
		countryOptionBtn.addEventListener("click", handleOptionSelect);
		countryOptionBtn.setAttribute("data-cc", countryOption.code);

		options.appendChild(countryOptionBtn);
	});

	triviaQuestion.appendChild(progressBar);
	triviaQuestion.appendChild(flagContainer);
	triviaQuestion.appendChild(options);

	const trivia = document.querySelector(".trivia");
	trivia.appendChild(triviaQuestion);
	trivia.addEventListener("touchmove", noScroll);

	let scrollTrivia = setInterval(scrollRightAnimation, 5);

	function scrollRightAnimation() {
		trivia.scrollLeft += 10;
		if (trivia.scrollLeft === trivia.scrollWidth - trivia.clientWidth) {
			clearInterval(scrollTrivia);
		}
	}
}

// function scrollRightAnimation() {
// 	const trivia = document.querySelector(".trivia");

// 	let scrollTrivia = setInterval(scroll, 5);
// 	function scroll() {
// 		trivia.scrollLeft += 10;
// 		if (trivia.scrollLeft === trivia.scrollWidth - trivia.clientWidth) {
// 			clearInterval(scrollTrivia);
// 			startCountdown(timeLimit);
// 		}
// 	}
// }

function noScroll(e) {
	return e.preventDefault();
}

function handleOptionSelect(event) {
	event.preventDefault();

	// allow scroll after guessing
	const trivia = document.querySelector(".trivia");
	trivia.removeEventListener("touchmove", noScroll);

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
	guessOptions.choice = event.target.attributes["data-cc"].value;
}

function createTriviaObject() {
	const countryCode = gameCodes[questionIndex()][0];
	//set the correct answer
	guessOptions.correctChoice = countryCode;

	// Generate country options
	let countryOptions = gameCodes[questionIndex()].map((code) => ({ code, country: filteredApiResponse[code] }));
	return {
		flag: `https://flagcdn.com/${countryCode}.svg`,
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
		playFile("/assets/audio/correct.mp3", audioCtx);

		if (questionIndex() + 1 === user.questionLimit) return gameBuild("limit", "Question Limit Reached");

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
	playFile("/assets/audio/incorrect.mp3", audioCtx);

	// subtract lives and store result
	user.lives--;

	resultsObject.choice = guessOptions.choice;
	user.guessResults.incorrectFlags.push(resultsObject);

	if (questionIndex() + 1 === user.questionLimit) return gameBuild("limit", "Question Limit Reached");

	if (user.lives === 0) return gameBuild("lives", "You ran out of lives");

	return gameBuild();
}

function startCountdown(timeLimit) {
	countdown = timeLimit;
	move(timeLimit, questionIndex());

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
	localStorage.setItem("user", JSON.stringify(user));

	setTimeout(() => {
		if (results) {
			document.querySelector(".fwf__display").classList.add("hide");
			document.querySelector(".gameover").classList.remove("hide");
			document.querySelector(".gameover__reason").innerText = string;

			// Store user information in database
			users.push(user);
			localStorage.setItem("users", JSON.stringify(users));

			// Conditionals for reaching question limit or running out of lives
			if (results === "limit") {
				playFile("/assets/audio/tada.wav", audioCtx);
				document.querySelector(".gameover__reason").classList.add("gameover__reason--success");
			}
			if (results === "lives") playFile("/assets/audio/failure.wav", audioCtx);

			return;
		}

		// reset game options
		guessOptions = { choice: null, correctChoice: null, timeRemaining: null };

		buildUserInfo(user);
		buildGameContainer(createTriviaObject());
	}, 100);
}

function startGame() {
	const questionNumber = user.guessResults.correctFlags.length + user.guessResults.incorrectFlags.length + 1;

	// if (questionNumber === user.questionLimit) return gameBuild("limit", "Question Limit Reached");
	// if (user.lives <= 0) return gameBuild("lives", "You ran out of lives");

	document.querySelector(".fwf__display").classList.remove("hide");
	gameBuild();
}

startGame();

// Button click delay to results page
document.querySelector(".fwf__results-button").addEventListener("click", () => {
	playFile("/assets/audio/click.wav", audioCtx);
	setTimeout(() => window.location.assign("../ResultsPage/index.html"), 350);
});
