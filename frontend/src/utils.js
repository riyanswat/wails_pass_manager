// import "./style.css";
// import "./app.css";

// const alertMessage = document.getElementById("alertMessage");

export function showAlert(elem, text) {
  elem.style.display = "inline-block";
  elem.innerText = text;

  setTimeout(() => {
    elem.style.display = "none";
  }, 1400);
}

if (typeof module !== "undefined") {
  module.exports = showAlert;
}
