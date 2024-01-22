import { App } from "./app.js";

export class Card {
  constructor(cardID, number, expiration, cvv, iban) {
    this.cardID = cardID;
    this.number = number;
    this.expiration = expiration;
    this.cvv = cvv;
    this.iban = iban;
  }
  static getElement(card) {
    const div = $("<div>")
      .append($("<span>").text(`Number: ${card.number}`))
      .append(
        $("<span>").text(`Date: ${App.formatDate(new Date(card.expiration))}`)
      )
      .append($("<span>").text(`CVV: ${card.cvv}`))
      .append(
        $("<button>")
          .click(function () {
            div.remove();
            App.Instance.bank.cards.splice(card.cardID, 1);
            App.Instance.save();
          })
          .text(`Remove`)
          .css("background", "indianred")
      );
    return div;
  }
}
