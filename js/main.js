import { App } from "./app.js";
import { User } from "./user.js";
import { Account } from "./account.js";
import { Card } from "./card.js";
import { Transaction } from "./transaction.js";

function clearData() {
  localStorage.clear();
}

var app = new App();

$(document).ready(function () {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  switch (page) {
    case "index.html": {
      if (app.bank.currentUserID === -1) {
        $(".container").prepend(
          $("<a>").attr("href", "./logIn.html").text(`Log In`)
        );
      } else {
        $(".container").prepend(
          $("<a>")
            .attr("href", "./personalUser.html")
            .text(
              `${app.getCurrentUser().firstName} ${
                app.getCurrentUser().lastName
              } ${app.getCurrentUser().middleName}`
            )
        );
      }
      break;
    }
    case "editDB.html": {
      $(".back").before(
        $("<button>")
          .text("Clear Data")
          .addClass("red")
          .click(function () {
            clearData();
          })
      );
    }
    case "addUser.html": {
      app.bank.users.forEach(function (user) {
        $("#db").append(User.getElement(user));
      });
      $("form").on("submit", function (event) {
        event.preventDefault();
        let newUser = new User(
          app.bank.users.length,
          this.firstName.value,
          this.middleName.value,
          this.lastName.value,
          this.phone.value,
          this.iin.value,
          this.password.value
        );
        $("#db").append(User.getElement(newUser));
        app.bank.users.push(newUser);
        app.save();

        $("form :input").each(function () {
          this.value = "";
        });
        alert("User added successfully");
      });
      break;
    }
    case "addAccount.html": {
      app.bank.accounts.forEach(function (account) {
        $("#db").append(Account.getElement(account));
      });
      $("form").on("submit", function (event) {
        event.preventDefault();
        if (isNaN(parseInt(this.balance.value))) {
          alert("balance is not number!");
          return;
        }
        if (
          app.bank.users.findIndex((user) => user.iin === this.iin.value) === -1
        ) {
          alert("There is no user with this IIN");
          return;
        }
        let newAccount = new Account(
          app.bank.accounts.length,
          this.title.value,
          new Date(),
          this.iin.value,
          this.iban.value,
          this.bic.value,
          this.currency.value,
          Number(this.balance.value)
        );
        $("#db").append(Account.getElement(newAccount));
        app.bank.accounts.push(newAccount);
        app.save();

        $("form :input").each(function () {
          this.value = "";
        });
        alert("Account added successfully");
      });
      break;
    }
    case "personalAccounts.html": {
      app.bank.accounts.forEach(function (account) {
        if (app.getCurrentUser().iin === account.iin) {
          let element = Account.getElement(account, false);
          element.children(":last").before(
            $("<button>")
              .text("Enter >")
              .click(function () {
                window.location.href = "./personalAccount.html";
                app.bank.currentAccountID = account.accountID;
                app.save();
              })
          );
          $("#db").append(element);
        }
      });
      $("form").on("submit", function (event) {
        event.preventDefault();
        if (isNaN(parseInt(this.balance.value))) {
          alert("balance is not number!");
          return;
        }
        let newAccount = new Account(
          app.bank.accounts.length,
          this.title.value,
          new Date(),
          app.getCurrentUser().iin,
          this.iban.value,
          this.bic.value,
          this.currency.value,
          Number(this.balance.value)
        );
        let element = Account.getElement(newAccount, false);
        element.children(":last").before(
          $("<button>")
            .text("Enter >")
            .click(function () {
              window.location.href = "./personalAccount.html";
              app.bank.currentAccountID = account.accountID;
              app.save();
            })
        );
        $("#db").append(element);
        app.bank.accounts.push(newAccount);
        app.save();

        $("form :input").each(function () {
          this.value = "";
        });
        alert("Account added successfully");
      });
      break;
    }
    case "personalCards.html": {
      app.bank.cards.forEach(function (card) {
        if (app.getCurrentAccount().iban === card.iban) {
          $("#db").append(Card.getElement(card));
        }
      });
      $("form").on("submit", function (event) {
        event.preventDefault();
        if (isNaN(parseInt(this.number.value))) {
          alert("Number value is not number!");
          return;
        }
        if (isNaN(parseInt(this.cvv.value))) {
          alert("CVV value is not number!");
          return;
        }
        let newCard = new Card(
          app.bank.cards.length,
          this.number.value,
          new Date(this.expiration.value),
          this.cvv.value,
          app.getCurrentAccount().iban
        );

        $("#db").append(Card.getElement(newCard));
        app.bank.cards.push(newCard);
        app.save();

        $("form :input").each(function () {
          this.value = "";
        });
        alert("Card added successfully");
      });
      break;
    }
    case "personalTransferHistory.html": {
      app.bank.transactions.forEach(function (transaction) {
        if (
          app.getCurrentAccount().iban === transaction.senderIBAN ||
          app.getCurrentAccount().iban === transaction.recipientIBAN
        ) {
          $("#db").append(Transaction.getElement(transaction));
        }
      });
      $("form").on("submit", function (event) {
        event.preventDefault();
        let recipient = app.bank.accounts.findIndex(
          (account) => account.iban === this.iban.value
        );
        if (recipient === -1) {
          alert("There is no account with this IBAN");
          return;
        }
        if (this.iban.value === app.getCurrentAccount().iban) {
          alert("You can't send money yourself!");
          return;
        }
        if (isNaN(parseInt(this.amount.value))) {
          alert("Amount value is not number!");
          return;
        }
        if (
          app.getCurrentAccount().currency !==
          app.bank.accounts[recipient].currency
        ) {
          alert("Accounts currency are not matching!");
          return;
        }
        if (0 === app.getCurrentAccount().balance) {
          alert("YOU HAVE NO MONEY, YOU AIN'T SENDING NOTHING TODAY!!");
          return;
        }
        if (Number(this.amount.value) > app.getCurrentAccount().balance) {
          alert("You can't send more than you already have!");
          return;
        }
        let newTransaction = new Transaction(
          app.bank.transactions.length,
          app.getCurrentAccount().iban,
          this.iban.value,
          app.getCurrentAccount().currency,
          Number(this.amount.value),
          new Date()
        );
        $("#db").append(Transaction.getElement(newTransaction));

        app.getCurrentAccount().balance -= Number(this.amount.value);
        app.bank.accounts[recipient].balance += Number(this.amount.value);

        app.bank.transactions.push(newTransaction);
        app.save();

        $("form :input").each(function () {
          this.value = "";
        });
        alert("Transaction completed successfully");
      });
      break;
    }
    case "logIn.html": {
      $("form").on("submit", function (event) {
        event.preventDefault();
        if (app.logIn(this.phone.value)) {
          window.location.href = "./personalUser.html";
          alert("Logged in successfully");
        } else {
          alert("There is no user with this phone number");
        }
      });
      break;
    }
    case "personalUser.html": {
      $(".container").append(
        $("<a>")
          .attr("href", "./index.html")
          .text("Log Out")
          .addClass("back")
          .click(function () {
            app.bank.currentUserID = -1;
            app.save();
          })
      );
      $("#db").append(
        User.getElement(app.getCurrentUser(), function () {
          window.location.href = "./index.html";
          app.bank.currentUserID = -1;
          app.save();
        })
      );
      break;
    }
    case "personalAccount.html": {
      $(".container").append(
        $("<a>")
          .attr("href", "./personalAccounts.html")
          .text("Back")
          .addClass("back")
          .click(function () {
            app.bank.currentAccountID = -1;
            app.save();
          })
      );
      $("#db").append(
        Account.getElement(app.getCurrentAccount(), false, function () {
          window.location.href = "./personalAccounts.html";
          app.bank.currentAccountID = -1;
          app.save();
        })
      );
      break;
    }
  }
});
