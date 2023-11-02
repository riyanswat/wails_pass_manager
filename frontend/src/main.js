import "./style.css";
import "./app.css";
import clipboardy from "clipboardy";

import logo from "./assets/images/logo-universal.jpg";
import { Generate } from "../wailsjs/go/main/App";
import { Palindrome } from "../wailsjs/go/main/App";
import { Add } from "../wailsjs/go/main/App";

document.getElementById("logo").src = logo;

// INPUT fields data
const passElement = document.getElementById("password");
const websiteElement = document.getElementById("website");
const emailElement = document.getElementById("email");

// BUTTONS:
const generateBtn = document.getElementById("generate-btn");
const addBtn = document.getElementById("add-btn");
const searchBtn = document.getElementById("search-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");

window.add_data = function () {
  try {
    Add(
      "data.json",
      websiteElement.value,
      emailElement.value,
      passElement.value
    )
      .then((res) => {
        document.getElementById("result").innerText = res;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

window.pal = function () {
  // checkStr = websiteElement.value;

  try {
    Palindrome(websiteElement.value)
      .then((res) => {
        document.getElementById("email").value = res;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

window.generate = function () {
  let length = 8;
  // resultElement.style.display = "block";

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

// ================================

// document.getElementById("submit").addEventListener("click", function (event) {
//   event.preventDefault(); // Prevent the default form submission

//   // Get data from the form
//   const website = document.getElementById("website").value;
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   // Create a data object
//   const formData = {
//     website,
//     email,
//     password,
//   };

//   // Send the data to the backend
//   wails.Events.Emit("formData", formData);
// });
