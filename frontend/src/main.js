import clipboardy from "clipboardy";
// import Swal from "sweetalert2";
import { showAlert } from "./utils";

// backend apis:
import { Generate, Add } from "../wailsjs/go/main/App";

// ===================================================

// INPUT FIELDS
const passElement = document.getElementById("password");
const websiteElement = document.getElementById("website");
const emailElement = document.getElementById("email");

// BUTTONS:
const generateBtn = document.getElementById("generate-btn");
const addBtn = document.getElementById("add-btn");
const searchBtn = document.getElementById("search-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const alertMessage = document.getElementById("alertMessage");

// ===================================================

addBtn.onclick = function () {
  // if (passElement.value == "") {
  //   document.getElementById("result").innerText = "empty pass";
  //   return;
  // }

  try {
    Add(
      "data.json",
      websiteElement.value,
      emailElement.value,
      passElement.value
    )
      .then((res) => {
        if (res == "Successful") {
          // document.getElementById("result").innerText = `${res}`;
          showAlert(alertMessage, `${res}`);

          websiteElement.value = "";
          emailElement.value = "";
          passElement.value = "";
        }
        if (res != "Successful") {
          showAlert(alertMessage, `Error: ${res}`);
          // document.getElementById("result").innerText = `Error: ${res}`;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

// ...
generateBtn.addEventListener("click", () => {
  generate();
  showAlert(alertMessage, "Password generated");
});

window.generate = function () {
  let length = 8;

  // Call App.Generate(length)
  try {
    Generate(length)
      .then((result) => {
        // Update result with data back from App.Generate()
        passElement.value = result;

        // Copy the result to the clipboard asynchronously
        clipboardy.write(result, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Password copied to clipboard!");
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};
