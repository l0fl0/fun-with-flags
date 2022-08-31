let user = {
	id: null,
	name: "",
	score: 0,
	lives: 2,
	difficulty: "standard",
	questionLimit: 0,
	guessResults: {
		incorrectFlags: [],
		correctFlags: [],
	},
};

const formEl = document.querySelector(".registration-form");
formEl.addEventListener("submit", handleSubmit);

// Username
const usernameInput = document.querySelector("#username");
usernameInput.focus();
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
	el.addEventListener("click", activeDifficulty);
	el.addEventListener("click", () =>
		new Audio("/assets/audio/click.wav").play()
	);
});

function activeDifficulty(event) {
	difficultyOptions.forEach((el) =>
		el.labels[0].classList.remove("registration-form__label--active")
	);
	event.target.labels[0].classList.add("registration-form__label--active");
}

// Question Limit Option
const limitOptions = document.querySelectorAll(
	".registration-form__limit-option"
);
limitOptions.forEach((el) => {
	el.addEventListener("click", activeLimit);
	el.addEventListener("click", () =>
		new Audio("/assets/audio/click.wav").play()
	);
});
function activeLimit(event) {
	limitOptions.forEach((el) =>
		el.labels[0].classList.remove("registration-form__limit-label--active")
	);
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

	localStorage.setItem("user", JSON.stringify(user));

	setTimeout(() => window.location.assign("/pages/FWFGame/index.html"), 700);
}
