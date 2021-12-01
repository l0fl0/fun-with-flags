function createPageElement(tag, className, data) {
    const element = document.createElement(tag);
    element.classList.add(className);
    if (data) {
        element.innerText = data;
    }
    return element;
}