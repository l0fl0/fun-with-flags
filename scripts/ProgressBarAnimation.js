export function move(progressTime) {
  let width = 100;
  let elem = document.getElementById("barStatus");

  let id = setInterval(frame, progressTime / 100);

  function frame() {
    if (width === 1) {
      elem.classList.remove("user-info__barstatus--middle", "user-info__barstatus--end");
      clearInterval(id);
    }
    if (width === 60) elem.classList.add("user-info__barstatus--middle");
    if (width === 30) elem.classList.add("user-info__barstatus--end");

    width--;
    elem.style.width = width + '%';
  }
}

