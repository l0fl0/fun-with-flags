/**
 * Returns Random Country code from counrtyCodes Array
 * */
export const randomCodeGenerator = () => {
  // random integer generator
  const getRandomInt = (maxnumber) => {
    maxnumber = countryCodes.length;
    return Math.floor(Math.random() * (maxnumber - 1));
  };
  // assigns random index to pull form array
  let randomCode = countryCodes[getRandomInt()];
  return randomCode;
};

/**
 * Create an element on page
 * * must define params tag and className, inner text is optional
 */
export const createPageElement = (tag, className, innerText) => {
  const element = document.createElement(tag);
  element.classList.add(className);

  if (innerText) element.innerText = innerText;

  return element;
};
