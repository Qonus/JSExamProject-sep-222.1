import { App } from "./app.js";

export class User {
  constructor(userID, firstName, middleName, lastName, phone, iin, password) {
    this.userID = userID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.phone = phone;
    this.iin = iin;
    this.password = password;
  }
  static getElement(user, func) {
    const div = $("<div>")
      .append(
        $("<span>").text(
          `Name: ${user.firstName} ${user.lastName} ${user.middleName}`
        )
      )
      .append($("<span>").text(`Phone: ${user.phone}`))
      .append($("<span>").text(`IIN: ${user.iin}`))
      .append($("<span>").text(`Password: ${user.password}`))
      .append(
        $("<button>")
          .click(function () {
            func();
            div.remove();
            App.Instance.bank.users.splice(user.userID, 1);
            if (user.userID === App.Instance.bank.currentUserID)
              App.Instance.bank.currentUserID = -1;
            App.Instance.save();
          })
          .text(`Remove`)
          .addClass("red")
      );
    return div;
  }
}
