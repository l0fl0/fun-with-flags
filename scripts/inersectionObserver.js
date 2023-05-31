const options = {
	root: null,
	rootMargin: "-0.625rem",
	threshold: 0,
};

const questionObserver = new IntersectionObserver(function (entries, observer) {
	entries.forEach((entry) => console.log(entry.target));
}, options);

export const attachObservers = (questions) => {
	questions.forEach((question) => {
		questionObserver.observe(question);
	});
};
