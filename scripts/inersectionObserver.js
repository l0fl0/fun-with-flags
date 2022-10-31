const questions = document.querySelectorAll(".trivia__question");

const options = {
	root: null,
	rootMargin: "-10px",
	threshold: 0,
};

const questionObserver = new IntersectionObserver(function (entries, observer) {
	entries.forEach((entry) => console.log(entry.target));
}, options);

questions.forEach((question) => {
	questionObserver.observe(question);
});
