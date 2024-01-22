import { User } from "./user.js";
import { Account } from "./account.js";
import { Card } from "./card.js";
import { Transaction } from "./transaction.js";

export class App {
  static Instance = null;
  constructor() {
    App.Instance = this;
    this.bank = {
      currentAccountID: -1,
      currentUserID: -1,
      users: [],
      accounts: [],
      cards: [],
      transactions: [],
    };
    if (localStorage.getItem("bank") !== null) {
      this.bank = JSON.parse(localStorage.getItem("bank"));
      console.log(this.bank);
    }
  }
  static formatDate(dateObj) {
    let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
      dateObj
    );
    let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
      dateObj
    );
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(dateObj);
    let time = new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(dateObj);
    return time + " | " + day + "." + month + "." + year;
  }
  static generateCode(codeLength = 6) {
    let max = Math.pow(10, codeLength) - 1;
    let min = Math.pow(10, codeLength - 1);
    return Math.round(Math.random() * (max - min) + min);
  }
  logIn(phone) {
    let index = this.bank.users.findIndex((user) => user.phone === phone);
    if (index === -1) return false;
    this.bank.currentUserID = index;
    this.save();
    let code = App.generateCode();
    console.log("your authentification code : " + code);
    return true;
  }
  getCurrentUser() {
    return this.bank.users[this.bank.currentUserID];
  }
  getCurrentAccount() {
    return this.bank.accounts[this.bank.currentAccountID];
  }
  save() {
    for (let i = 0; i < this.bank.users.length; i++) {
      this.bank.users[i].userID = i;
    }
    for (let i = 0; i < this.bank.accounts.length; i++) {
      this.bank.accounts[i].accountID = i;
    }
    for (let i = 0; i < this.bank.cards.length; i++) {
      this.bank.cards[i].cardID = i;
    }
    for (let i = 0; i < this.bank.transactions.length; i++) {
      this.bank.transactions[i].transactionID = i;
    }
    localStorage.setItem("bank", JSON.stringify(this.bank));
  }
}
