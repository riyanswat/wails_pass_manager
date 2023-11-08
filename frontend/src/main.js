import clipboardy from "clipboardy";
import Swal from "sweetalert2";
import { showAlert, copyToClipboard } from "./utils";
// backend apis:
import { Generate, Add, Delete } from "../wailsjs/go/main/App";

class PasswordManager {
  constructor() {
    // intput and output elements
    this.passElement = document.getElementById("password");
    this.websiteElement = document.getElementById("website");
    this.emailElement = document.getElementById("email");
    this.alertMessage = document.getElementById("alertMessage");
    // buttons
    this.generateBtn = document.getElementById("generate-btn");
    this.addBtn = document.getElementById("add-btn");
    this.searchBtn = document.getElementById("search-btn");
    this.editBtn = document.getElementById("edit-btn");
    this.deleteBtn = document.getElementById("delete-btn");
    this.showAllBtn = document.getElementById("show-btn");

    // values
    this.passwordLength = 8;

    this.initEventHandlers();
  }

  initEventHandlers() {
    this.addBtn.addEventListener("click", this.handleAdd.bind(this));
    this.deleteBtn.addEventListener("click", this.handleDelete.bind(this));
    this.generateBtn.addEventListener("click", this.handleGenerate.bind(this));
    this.showAllBtn.addEventListener("click", this.handleShowAll.bind(this));
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  }

  handleAdd() {
    // Handle add button click event
    try {
      Add(
        this.websiteElement.value,
        this.emailElement.value,
        this.passElement.value
      )
        .then((res) => {
          if (res === "Successful") {
            showAlert(this.alertMessage, `${res}`);
            this.websiteElement.value = "";
            this.emailElement.value = "";
            this.passElement.value = "";
          } else {
            showAlert(this.alertMessage, `Error: ${res}`);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }

  handleDelete() {
    if (!this.websiteElement.value) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    }
    // ================================================
    // TODO
    // check if website exists in data.json
    // if yes, fire Swal
    // if delete is pressed, remove data from data.json
    // else cancel the Swal

    // 000000000000000000000000000000000000000000000000000000000
    fetch("../data/data.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (this.websiteElement.value.toLowerCase() == item.website) {
            this.websiteElement.value = "";
            // 777777777777777777777777777777777777777777777
            Swal.fire({
              title: `Do you want to delete '${this.websiteElement.value}'?`,
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete it",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Deleted!",
                  text: `${this.websiteElement.value} has been deleted`,
                  icon: "success",
                });
              }
            });
            // 777777777777777777777777777777777777777777777

            const emailAdd = item.email;
            const password = item.password;
          }
        });

        Swal.fire({
          title: `Email and password for '${this.websiteElement.value}'`,
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
      });
    // 000000000000000000000000000000000000000000000000000000000

    // ================================================

    try {
      Delete(this.websiteElement.value)
        .then((res) => {
          showAlert(this.alertMessage, res);
          this.websiteElement.value = "";
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }

  handleGenerate() {
    Generate(this.passwordLength)
      .then((result) => {
        this.passElement.value = result;
        copyToClipboard("Password", result);
      })
      .catch((err) => {
        console.error(err);
      });

    showAlert(alertMessage, "Password generated");
  }

  handleShowAll() {
    window.location.href = "./src/all_data.html";
  }

  handleSearch() {
    if (!this.websiteElement.value) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    }
    let itemEmail = "";
    let itemPass = "";

    if (this.websiteElement.value) {
      fetch("../data/data.json")
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data
            .map((item) => {
              if (item.website == this.websiteElement.value.toLowerCase()) {
                this.websiteElement.value = "";
                itemEmail = item.email;
                itemPass = item.password;

                return `<strong>Email:</strong> ${item.email} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
                <br><strong>Password:</strong> ${item.password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

                // `<strong>Email:</strong> ${item.email}<br><strong>Password:</strong> ${item.password}`;
              }
            })
            .join("\n");
          Swal.fire({
            title: this.websiteElement.value,
            html: formattedData,
            icon: "info",
          });

          // ----------------------------------------
          let copyEmail = document.getElementById("copy-email");
          let copyPass = document.getElementById("copy-pass");

          copyEmail.onclick = function () {
            copyToClipboard("email", itemEmail);
          };

          copyPass.onclick = function () {
            copyToClipboard("password", itemPass);
          };
        })
        .catch((error) => console.error(`Error: ${error}`));
    }
  }
}

// instance of PasswordManager
const passwordManager = new PasswordManager();
