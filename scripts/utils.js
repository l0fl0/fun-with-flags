/**
 * 
 * @param {number} maxnumber
 * @returns a random number
 */
export const getRandomInt = (maxnumber) => (Math.floor(Math.random() * (maxnumber - 1)));

/**
 * Fisher - Yates SHUFFLE ALGORITM https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param {array} array 
 * @returns a shuffled array
 */
export function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = getRandomInt(currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

/**
 * Create an element on page
 * You must define args tag and className, inner text is optional
 * @param {string} tag 
 * @param {string} className 
 * @param {string} innerText 
 * @returns a shuffled array
 */
export const createPageElement = (tag, className, innerText = null) => {
  const element = document.createElement(tag);
  element.classList.add(className);

  if (innerText) element.innerText = innerText;

  return element;
};



