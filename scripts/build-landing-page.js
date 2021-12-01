function buildForm() {
    // Form container 

    const formContainer = createPageElement("div", "register__form-container", null);

    // Form

    const formEl = createPageElement("form", "register__form", null);

    // Name field

    const nameEl = createPageElement("input", "register__form-field", null);
    nameEl.name = "fullName";
    nameEl.id = "fullName";
    nameEl.placeholder = "Enter full name"
    const nameLabel = createPageElement("label", "register__form-label", "Name");

    formEl.appendChild(nameLabel);
    formEl.appendChild(nameEl);

    formContainer.appendChild(formEl);

    return formContainer;
}

function buildRegister() {
    // Get 'register' HTML section
    const registerEl = document.querySelector(".register")

    // Title

    const title = createPageElement("h2", "register__title", "Are you ready?");
    registerEl.appendChild(title)

    const form = buildForm();
    registerEl.appendChild(form);
}

buildRegister();