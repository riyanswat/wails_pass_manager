import clipboardy from "clipboardy";
import Swal from "sweetalert2";
import { showAlert, copyToClipboard } from "./utils";
// backend apis:
import {
  Generate,
  Add,
  Delete,
  Search,
  AllData,
} from "../wailsjs/go/backend/App";

class PasswordManager {
  constructor() {
    // input and output elements
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

    // other elements
    this.dataTableBody = document.getElementById("data-table-body");
    this.allDataElem = document.getElementById("all-data");
    this.appElem = document.getElementById("app");
    this.homeKey = document.getElementById("home");

    this._initEventHandlers();
  }

  _initEventHandlers() {
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
    const websiteToDelete = this.websiteElement.value;
    if (!websiteToDelete) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    }
    Search(websiteToDelete).then((res) => {
      if (res[1] == "yes") {
        //* Confirm deletion
        Swal.fire({
          title: "Are you sure?",
          text: `Do you really want to delete '${websiteToDelete}'?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            //* Deletion:
            Delete(websiteToDelete).then((res) => showAlert(alertMessage, res));

            //* Deletion successful
            Swal.fire({
              title: "Deleted!",
              text: `'${websiteToDelete}' has been deleted.`,
              icon: "success",
            });
            this._clearFields();
          }
        });
      } else if (res[1] == "no") {
        showAlert(this.alertMessage, "Website doesn't exist");
      }
    });
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

  _toggleDisplay() {
    this.allDataElem.style.display = "block";
    this.appElem.style.display = "none";
    this.homeKey.onclick = () => {
      this.allDataElem.style.display = "none";
      this.appElem.style.display = "flex";
    };
  }

  handleShowAll() {
    this.dataTableBody.innerHTML = "";

    this._toggleDisplay();
    // this.allDataElem.style.display = "block";
    // this.appElem.style.display = "none";
    // this.homeKey.onclick = () => {
    //   this.allDataElem.style.display = "none";
    //   this.appElem.style.display = "flex";
    // };

    AllData().then((data) => {
      // showAlert(this.alertMessage, data);
      for (let entry of data) {
        console.log(entry.website);
        console.log(entry.email);
        console.log(entry.password);

        const row = document.createElement("tr");
        const websiteCell = document.createElement("td");
        websiteCell.textContent = entry.website;
        const emailCell = document.createElement("td");
        emailCell.textContent = entry.email;
        const passwordCell = document.createElement("td");
        passwordCell.textContent = entry.password;

        row.appendChild(websiteCell);
        row.appendChild(emailCell);
        row.appendChild(passwordCell);
        this.dataTableBody.appendChild(row);
      }
    });
  }

  handleSearch() {
    const websiteToSearch = this.websiteElement.value;
    if (!websiteToSearch) {
      showAlert(this.alertMessage, "Please enter a website");
      return;
    }
    let itemEmail = "";
    let itemPass = "";

    Search(websiteToSearch).then((res) => {
      if (res[1] == "no") {
        showAlert(this.alertMessage, "Website doesn't exist");
        return;
      } else {
        itemEmail = res[0].email;
        itemPass = res[0].password;

        const formattedData = `<strong style="user-select: none;">Email:</strong> ${itemEmail} <span id="copy-email" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>
                <br><strong style="user-select: none;">Password:</strong> ${itemPass} <span id="copy-pass" style="cursor: pointer; user-select: none;">&#x1F4CB;</span>`;

        Swal.fire({
          title: websiteToSearch,
          html: formattedData,
          icon: "info",
        });

        let copyEmail = document.getElementById("copy-email");
        let copyPass = document.getElementById("copy-pass");

        copyEmail.onclick = function () {
          copyToClipboard("email", itemEmail);
          copyEmail.innerHTML = `<span style="background-color: #3498db; color: #fff; padding: 0 10px 0 10px; border-radius: 4px;">Copied!</span>`;
          setTimeout(() => {
            copyEmail.innerHTML = "&#x1F4CB;";
          }, 500);
        };

        copyPass.onclick = function () {
          copyToClipboard("password", itemPass);
          copyPass.innerHTML = `<span style="background-color: #3498db; color: #fff; padding: 0 20px 0 20px; border-radius: 4px;">Copied!</span>`;
          setTimeout(() => {
            copyPass.innerHTML = "&#x1F4CB;";
          }, 500);
        };

        this._clearFields();
      }
    });
  }
}

// instance of PasswordManager
const passwordManager = new PasswordManager();
