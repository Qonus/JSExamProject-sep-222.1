import { App } from "./app.js";

export class Transaction {
  constructor(
    transactionID,
    senderIBAN,
    recipientIBAN,
    currency,
    amount,
    date
  ) {
    this.transactionID = transactionID;
    this.senderIBAN = senderIBAN;
    this.recipientIBAN = recipientIBAN;
    this.currency = currency;
    this.amount = amount;
    this.date = date;
  }
  static getElement(transaction) {
    const div = $("<div>")
      .append($("<span>").text(`Sender's IBAN: ${transaction.senderIBAN}`))
      .append(
        $("<span>").text(`Recipient's IBAN: ${transaction.recipientIBAN}`)
      )
      .append($("<span>").text(`Currency: ${transaction.currency}`))
      .append($("<span>").text(`Amount: ${transaction.amount}`))
      .append(
        $("<span>").text(`Date: ${App.formatDate(new Date(transaction.date))}`)
      );
    return div;
  }
}
