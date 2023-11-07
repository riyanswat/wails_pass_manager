import clipboardy from "clipboardy";
import Swal from "sweetalert2";
// import { showAlert } from "./utils";
import { showAlert, copyToClipboard } from "./utils";

// backend apis:
import { Generate, Add, Delete } from "../wailsjs/go/main/App";

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
const showAllBtn = document.getElementById("show-btn");
const alertMessage = document.getElementById("alertMessage");

// ===================================================

addBtn.onclick = function () {
  // if (passElement.value == "") {
  //   document.getElementById("result").innerText = "empty pass";
  //   return;
  // }

  try {
    Add(websiteElement.value, emailElement.value, passElement.value)
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

deleteBtn.onclick = function () {
  try {
    Delete(websiteElement.value)
      .then((res) => {
        showAlert(alertMessage, res);
        websiteElement.value = "";
        // if (res == "Successful") {
        //   // document.getElementById("result").innerText = `${res}`;
        //   showAlert(alertMessage, `${res}`);

        //   websiteElement.value = "";
        //   emailElement.value = "";
        //   passElement.value = "";
        // }
        // if (res != "Successful") {
        //   showAlert(alertMessage, `Error: ${res}`);
        //   // document.getElementById("result").innerText = `Error: ${res}`;
        // }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

generateBtn.onclick = function () {
  generate();
  showAlert(alertMessage, "Password generated");
};

window.generate = function () {
  let length = 8;

  // Call App.Generate(length)
  try {
    Generate(length)
      .then((result) => {
        // Update result with data back from App.Generate()
        passElement.value = result;
        copyToClipboard("Password", result);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

showAllBtn.onclick = function () {
  window.location.href = "./src/all_data.html";
};

searchBtn.onclick = function () {
  if (!websiteElement.value) {
    showAlert(alertMessage, "Please enter website name");
    return;
  }
  let emailAdd = "";
  let password = "";

  if (websiteElement.value) {
    fetch("../data/data.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (websiteElement.value.toLowerCase() == item.website) {
            emailAdd = item.email;
            password = item.password;
          }
        });

        Swal.fire({
          title: `Email and password for '${websiteElement.value}'`,
          html: `<strong>Email:</strong> ${emailAdd} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
          <br><strong>Password:</strong> ${password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`,

          // text: `Email: ${emailAdd}\nPassword: ${password}`,
          icon: "info",
        }); // swal end

        let copyEmail = document.getElementById("copy-email");
        let copyPass = document.getElementById("copy-pass");

        // ----------------------------------------
        copyEmail.onclick = function () {
          copyToClipboard("email", emailAdd);
        };

        copyPass.onclick = function () {
          copyToClipboard("password", password);
        };
        // ----------------------------------------
      })
      .catch((error) => console.error(`Error: ${error}`));
  }
};
