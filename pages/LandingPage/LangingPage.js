let localUser = JSON.parse(localStorage.getItem("user"))
	? JSON.parse(localStorage.getItem("user"))
	: null;
console.log(localUser.name || "");
let user = {
	id: null,
	name: localUser.name || "",
	score: 0,
	lives: 2,
	difficulty: localUser.difficulty || "standard",
	questionLimit: localUser.questionLimit || 30,
	guessResults: {
		incorrectFlags: [],
		correctFlags: [],
	},
};

const formEl = document.querySelector(".registration-form");
formEl.addEventListener("keydown", handleKeypress);
formEl.addEventListener("submit", handleSubmit);

// handle enter for mobile enter does not start game
function handleKeypress(e) {
	if (e.key === "Enter") {
		e.preventDefault();
		new Audio("/assets/audio/keypress.wav").play();
		const index = [...formEl].indexOf(e.target);
		formEl.elements[index + 1].focus();
		return false;
	}
}

// Username
const usernameInput = document.querySelector("#username");
usernameInput.value = user.name;
usernameInput.addEventListener("input", () =>
	new Audio("/assets/audio/keypress.wav").play()
);
usernameInput.addEventListener("click", () =>
	new Audio("/assets/audio/click.wav").play()
);

// Difficutly Option
const difficultyOptions = document.querySelectorAll(
	".registration-form__difficulty-option"
);
difficultyOptions.forEach((el) => {
	if (el.value === user.difficulty) {
		el.labels[0].classList.add("registration-form__difficulty-label--active");
		el.setAttribute("checked", "true");
	}

	el.addEventListener("click", activeDifficulty);
	el.addEventListener("click", () =>
		new Audio("/assets/audio/click.wav").play()
	);
});

function activeDifficulty(event) {
	difficultyOptions.forEach((el) => {
		el.labels[0].classList.remove(
			"registration-form__difficulty-label--active"
		);
		el.setAttribute("checked", "false");
	});
	event.target.setAttribute("checked", "true");
	event.target.labels[0].classList.add(
		"registration-form__difficulty-label--active"
	);
}

// Question Limit Option
const limitOptions = document.querySelectorAll(
	".registration-form__limit-option"
);
limitOptions.forEach((el) => {
	if (el.value === user.questionLimit) {
		el.labels[0].classList.add("registration-form__limit-label--active");
		el.setAttribute("checked", "true");
	}

	el.addEventListener("click", activeLimit);
	el.addEventListener("click", () =>
		new Audio("/assets/audio/click.wav").play()
	);
});

function activeLimit(event) {
	limitOptions.forEach((el) => {
		el.labels[0].classList.remove("registration-form__limit-label--active");
		el.setAttribute("checked", "false");
	});
	event.target.setAttribute("checked", "true");
	event.target.labels[0].classList.add(
		"registration-form__limit-label--active"
	);
}

// Form submit handler
function handleSubmit(event) {
	event.preventDefault();

	new Audio(
		"/assets/audio/fartbiscuit1700__8-bit-arcade-video-game-start-sound-effect-gun-reload-and-jump.wav"
	).play();

	// Store registration information
	user.id = crypto.randomUUID
		? crypto.randomUUID()
		: Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

	user.name = event.target.username.value;
	user.difficulty = event.target.difficulty.value;
	user.questionLimit = event.target.questionLimit.value;
	user.score = 0;

	if (user.difficulty === "hard") user.lives = 3;
	else user.lives = 2;

	localStorage.setItem("user", JSON.stringify(user));

	setTimeout(() => window.location.assign("/pages/FWFGame/index.html"), 700);
}
