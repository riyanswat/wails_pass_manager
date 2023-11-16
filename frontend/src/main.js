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

  clearFields() {
    this.websiteElement.value = "";
    this.emailElement.value = "";
    this.passElement.value = "";
  }

  handleAdd() {
    let websiteExists = false;

    try {
      Add(
        this.websiteElement.value,
        this.emailElement.value,
        this.passElement.value
      )
        .then((res) => {
          if (res === "Successful") {
            showAlert(this.alertMessage, `${res}`);
            this.clearFields();
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

    //* ===========================================================
    //! ===========================================================
    // TODO:
    //*      check if the website already exists in the json
    //*      if it exists:
    //*        tell the user it already exists and exit

    //! Erroneous code for checking if web already exists:
    // if (this.websiteElement.value) {
    //   fetch("../data/data.json")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       for (let entry of data) {
    //         if (entry["website"] == this.websiteElement.value.toLowerCase()) {
    //           websiteExists = true;
    //           // this.clearFields();
    //           break;
    //           showAlert(this.alertMessage, "Website already exists!");
    //           return;
    //         } else {
    //         }
    //       }
    //       // if (websiteExists) {
    //       //   return;
    //       // }
    //     });
    // }
    //! Erroneous code for checking if web already exists ^^

    //       const formattedData = data
    //         .map((item) => {
    //           if (item.website == this.websiteElement.value.toLowerCase()) {
    //             this.websiteElement.value = "";
    //             itemEmail = item.email;
    //             itemPass = item.password;

    //             return `<strong>Email:</strong> ${item.email} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
    //             <br><strong>Password:</strong> ${item.password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

    //             // `<strong>Email:</strong> ${item.email}<br><strong>Password:</strong> ${item.password}`;
    //           }
    //         })
    //         .join("\n");
    //       Swal.fire({
    //         title: this.websiteElement.value,
    //         html: formattedData,
    //         icon: "info",
    //       });

    //       // ----------------------------------------
    //       let copyEmail = document.getElementById("copy-email");
    //       let copyPass = document.getElementById("copy-pass");

    //       copyEmail.onclick = function () {
    //         copyToClipboard("email", itemEmail);
    //       };

    //       copyPass.onclick = function () {
    //         copyToClipboard("password", itemPass);
    //       };
    //     })
    //     .catch((error) => console.error(`Error: ${error}`));
    // }

    //* ===========================================================
    //! ===========================================================
  }

  //! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  handleDelete() {
    if (!this.websiteElement.value) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    } else {
      try {
        Delete(this.websiteElement.value)
          .then((res) => {
            showAlert(this.alertMessage, res);
            this.clearFields();
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (err) {
        console.error(err);
      }

      //? Uncomment and refactor:
      // let websiteFound = false;

      // fetch("../data/data.json")
      //   .then((response) => response.json())
      //   .then((data) => {
      //     for (let entry of data) {
      //       if (entry["website"] == this.websiteElement.value.toLowerCase()) {
      //         websiteFound = true;
      //         //? SWAL:
      //         Swal.fire({
      //           title: "Are you sure?",
      //           text: `Do you really want to delete ${this.websiteElement.value}?`,
      //           icon: "warning",
      //           showCancelButton: true,
      //           confirmButtonColor: "#d33",
      //           cancelButtonColor: "#3085d6",
      //           confirmButtonText: "Yes, delete it!",
      //         }).then((result) => {
      //           if (result.isConfirmed) {

      //             //* deletion confirmed
      //             Swal.fire({
      //               title: "Deleted!",
      //               text: `${this.websiteElement.value} has been deleted.`,
      //               icon: "success",
      //             });
      //           }
      //         });
      //         break;
      //       }

      //       if (!websiteFound) {
      //         showAlert(this.alertMessage, "Website not found");
      //         return;
      //       }
      //     }
      //   })
      //   .catch((error) => console.error(`Error: ${error}`));
    }
  }
  //* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // handleDelete() {
  //   //! THIS METHOD IS STILL BUGGY!
  //   //? I first need to somehow call the Go delete method
  //   //? and check there whether the website already exists in the json
  //   if (!this.websiteElement.value) {
  //     showAlert(this.alertMessage, "Please enter a website");
  //     return;
  //   } else {
  //     let websiteFound = false;

  //     fetch("../data/data.json")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         for (let entry of data) {
  //           if (entry["website"] == this.websiteElement.value.toLowerCase()) {
  //             websiteFound = true;
  //             //? SWAL:
  //             Swal.fire({
  //               title: "Are you sure?",
  //               text: `Do you really want to delete ${this.websiteElement.value}?`,
  //               icon: "warning",
  //               showCancelButton: true,
  //               confirmButtonColor: "#d33",
  //               cancelButtonColor: "#3085d6",
  //               confirmButtonText: "Yes, delete it!",
  //             }).then((result) => {
  //               if (result.isConfirmed) {
  //                 try {
  //                   Delete(this.websiteElement.value)
  //                     .then((res) => {
  //                       showAlert(this.alertMessage, res);
  //                       this.clearFields();
  //                     })
  //                     .catch((err) => {
  //                       console.error(err);
  //                     });
  //                 } catch (err) {
  //                   console.error(err);
  //                 }
  //                 //* deletion confirmed
  //                 Swal.fire({
  //                   title: "Deleted!",
  //                   text: `${this.websiteElement.value} has been deleted.`,
  //                   icon: "success",
  //                 });
  //               }
  //             });
  //             break;
  //           }

  //           if (!websiteFound) {
  //             showAlert(this.alertMessage, "Website not found");
  //             return;
  //           }
  //         }
  //       })
  //       .catch((error) => console.error(`Error: ${error}`));
  //   }
  // }

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
          for (let entry of data) {
            if (entry["website"] == this.websiteElement.value.toLowerCase()) {
              this.clearFields();
              itemEmail = entry.email;
              itemPass = entry.password;

              const formattedData = `<strong>Email:</strong> ${entry.email} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
                <br><strong>Password:</strong> ${entry.password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

              //! ==================================================
              // function swalAlert(title, html, icon) {
              //   Swal.fire({
              //     title: title,
              //     html: html,
              //     icon: icon,
              //   });
              // }

              // swalAlert(this.websiteElement.value, formattedData, "info");
              //! ==================================================
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

              // console.log(entry);
              // console.log(entry.email);
              // console.log(entry.password);
            } // if stat
          } // for loop

          // TODO: Uncomment and refactor:
          // const formattedData = data
          //   .map((item) => {
          //     if (item.website == this.websiteElement.value.toLowerCase()) {
          //       this.websiteElement.value = "";
          //       itemEmail = item.email;
          //       itemPass = item.password;

          //       return `<strong>Email:</strong> ${item.email} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
          //       <br><strong>Password:</strong> ${item.password} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

          //       // `<strong>Email:</strong> ${item.email}<br><strong>Password:</strong> ${item.password}`;
          //     }
          //   })
          //   .join("\n");
          // Swal.fire({
          //   title: this.websiteElement.value,
          //   html: formattedData,
          //   icon: "info",
          // });

          // // ----------------------------------------
          // let copyEmail = document.getElementById("copy-email");
          // let copyPass = document.getElementById("copy-pass");

          // copyEmail.onclick = function () {
          //   copyToClipboard("email", itemEmail);
          // };

          // copyPass.onclick = function () {
          //   copyToClipboard("password", itemPass);
          // };
        })
        .catch((error) => console.error(`Error: ${error}`));
    }
  }
}

// instance of PasswordManager
const passwordManager = new PasswordManager();
