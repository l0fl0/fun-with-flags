const howToEl = document.querySelector(".how-to-play");
const registerEl = document.querySelector(".register");
const gameEl = document.querySelector(".fwf-game");

function hideSections() {
  howToEl.classList.add("hide");
  registerEl.classList.add("hide");
}
function showGame() {
  gameEl.classList.add("show");
}

// Form submit handler
function handleSubmit(event) {
  event.preventDefault();
  user.name = event.target.name.value;
  // localStorage.setItem("user", JSON.stringify(user));



  setTimeout(() => {
    hideSections();
    showGame()
  }, 1000)

  buildUserInfo(user)
};

const formEl = document.querySelector(".register__form");

formEl.addEventListener("submit", handleSubmit);




















// // ? Do we want to dynamically build the form or just have it static? 

// function buildForm() {
//   // Form container 
//   const formContainer = createPageElement("div", "register__form-container", null);

//   /* Form
//   TODO: Need to center the form
//   */
//   const formEl = createPageElement("form", "register__form", null);

//   // Name field
//   const nameEl = createPageElement("input", "register__form-field", null);
//   nameEl.name = "fullName";
//   nameEl.id = "fullName";
//   nameEl.placeholder = "Enter full name"
//   const nameLabel = createPageElement("label", "register__form-label", "Name");

//   formEl.appendChild(nameLabel);
//   formEl.appendChild(nameEl);

//   formContainer.appendChild(formEl);

//   const button = createButton("Let's go!");
//   formContainer.appendChild(button);

//   return formContainer;
// }




// function buildRegister() {
//   // Get 'register' HTML section
//   const registerEl = document.querySelector(".register")

//   // Title

//   const title = createPageElement("h2", "register__title", "Are you ready?");
//   registerEl.appendChild(title)

//   const form = buildForm();
//   registerEl.appendChild(form);
// }

// buildRegister();