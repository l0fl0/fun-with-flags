function createButton(buttonContent) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.innerText = buttonContent;

  return button;
}