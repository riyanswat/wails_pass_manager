// use these methods in main.js if you don't want to store the password
// in session storage and have to enter it over and over again

// --------------------------------------------------------------------------

// PasswordProtect().then((main_password) => {
//   this.passwordProtection = main_password; // set it to 'main_password' to enable pass protection
// });

// --------------------------------------------------------------------------

// async _getPassword() {
//   const { value: password } = await Swal.fire({
//     title: "Enter your password",
//     input: "password",
//     inputLabel: "Password",
//     inputPlaceholder: "Enter your password",
//     inputAttributes: {
//       maxlength: "10",
//       autocapitalize: "off",
//       autocorrect: "off",
//     },
//   });

//   return password;
// }

// --------------------------------------------------------------------------

// async _validatePassword() {
//   // Check if password protection is enabled
//   if (this.passwordProtection !== null) {
//     const password = await this._getPassword();
//     if (password !== this.passwordProtection) {
//       Swal.fire("Incorrect password");
//       return false;
//     }
//   }
//   return true;
// }
