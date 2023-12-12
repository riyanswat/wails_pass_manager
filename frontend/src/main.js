import clipboardy from "clipboardy";
import Swal from "sweetalert2";
import { showAlert, copyToClipboard } from "./utils";
// backend apis:
import { Generate, Add, Delete, Search } from "../wailsjs/go/backend/App";

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

  _clearFields() {
    this.websiteElement.value = "";
    this.emailElement.value = "";
    this.passElement.value = "";
  }

  handleAdd() {
    try {
      Add(
        this.websiteElement.value,
        this.emailElement.value,
        this.passElement.value
      )
        .then((res) => {
          if (res === "Successful") {
            showAlert(this.alertMessage, `${res}`);
            this._clearFields();
            return;
          } else {
            showAlert(this.alertMessage, `Error: ${res}`);
            return;
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
    // get the exposed Go Search api here
    Search(this.websiteElement.value).then((res) => {
      if (res == "yes") {
        //! ===========================================================
        //? +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //* -----------------------------------------------------------

        Swal.fire({
          title: "Are you sure?",
          text: `Do you really want to delete ${this.websiteElement.value}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            //? PERFORM DELETION HERE
            Swal.fire({
              title: "Deleted!",
              text: `${this.websiteElement.value} has been deleted.`,
              icon: "success",
            });
            this._clearFields();
          }
          //   // Delete(this.websiteElement.value).then((res) => {
          //     console.log(res);
          //     showAlert(this.alertMessage, res);
          //     // this._clearFields();
          //   });

          // }
        });

        //! ===========================================================
        //? +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //* -----------------------------------------------------------
      } else if (res == "no") {
        showAlert(this.alertMessage, "Website doesn't exist");
      }
    });
    // if (Search(this.websiteElement.value) == "yes") {
    //   showAlert(this.alertMessage, "website found (Search api)");
    // } else if()

    // if (!this.websiteElement.value) {
    //   showAlert(this.alertMessage, "Please enter a website");
    //   return;
    // } else {
    //   fetch("../../backend/embed/data.json")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       let websiteFound = false;

    //       for (let i = 0; i < data.length; i++) {
    //         if (data[i].website == this.websiteElement.value) {
    //           console.log(
    //             "FOUND",
    //             `data[i].website: ${data[i].website} ~~ this.websiteElement.value: ${this.websiteElement.value}`
    //           );

    //           Swal.fire({
    //             title: "Are you sure?",
    //             text: `Do you really want to delete ${this.websiteElement.value}?`,
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#d33",
    //             cancelButtonColor: "#3085d6",
    //             confirmButtonText: "Yes, delete it!",
    //           }).then((result) => {
    //             console.log(result);
    //             if (result.isConfirmed) {
    //               Delete(this.websiteElement.value).then((res) => {
    //                 console.log(res);
    //                 showAlert(this.alertMessage, res);
    //                 // this._clearFields();
    //               });

    //               Swal.fire({
    //                 title: "Deleted!",
    //                 text: `${this.websiteElement.value} has been deleted.`,
    //                 icon: "success",
    //               });

    //               this._clearFields();
    //             }
    //           });

    //           websiteFound = true;
    //           break; // break out of the loop if found
    //         }
    //       }

    //       if (!websiteFound) {
    //         console.log("NOT FOUND");
    //         showAlert(
    //           this.alertMessage,
    //           `${this.websiteElement.value} not found`
    //         );
    //         return;
    //       }
    //     });
    // }
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
    window.location.href = "../all_data.html";
  }

  handleSearch() {
    if (!this.websiteElement.value) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    }
    let itemEmail = "";
    let itemPass = "";

    if (this.websiteElement.value) {
      fetch("../../backend/embed/data.json")
        .then((response) => response.json())
        .then((data) => {
          for (let entry of data) {
            if (entry["website"] == this.websiteElement.value.toLowerCase()) {
              this._clearFields();
              itemEmail = entry.email;
              itemPass = entry.password;

              const formattedData = `<strong>Email:</strong> ${entry.email} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
                <br><strong>Password:</strong> ${entry.password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

              Swal.fire({
                title: this.websiteElement.value,
                html: formattedData,
                icon: "info",
              });

              let copyEmail = document.getElementById("copy-email");
              let copyPass = document.getElementById("copy-pass");

              copyEmail.onclick = function () {
                copyToClipboard("email", itemEmail);
              };

              copyPass.onclick = function () {
                copyToClipboard("password", itemPass);
              };
            } // if stat
          } // for loop
        })
        .catch((error) => console.error(`Error: ${error}`));
    }
  }
}

// instance of PasswordManager
const passwordManager = new PasswordManager();
