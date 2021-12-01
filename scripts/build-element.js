function createPageElement(tag, className, innerText) {
  const element = document.createElement(tag);
  element.classList.add(className);
  if (innerText) {
    element.innerText = innerText;
  }
  return element;
}