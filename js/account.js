import { App } from "./app.js";

export class Account {
  constructor(accountID, title, date, iin, iban, bic, currency, balance) {
    this.accountID = accountID;
    this.title = title;
    this.date = date;
    this.iin = iin;
    this.iban = iban;
    this.bic = bic;
    this.currency = currency;
    this.balance = balance;
  }
  static getElement(account, iin = true, func) {
    const div = $("<div>")
      .append($("<span>").text(`Name: ${account.title}`))
      .append(
        $("<span>").text(`Date: ${App.formatDate(new Date(account.date))}`)
      );
    if (iin) div.append($("<span>").text(`IIN: ${account.iin}`));
    div
      .append($("<span>").text(`IBAN: ${account.iban}`))
      .append($("<span>").text(`BIC: ${account.bic}`))
      .append($("<span>").text(`Currency: ${account.currency}`))
      .append($("<span>").text(`Balance: ${account.balance}`))
      .append(
        $("<button>")
          .click(function () {
            func();
            div.remove();
            App.Instance.bank.accounts.splice(account.accountID, 1);
            App.Instance.save();
          })
          .text(`Remove`)
          .css("background", "indianred")
      );
    return div;
  }
}
