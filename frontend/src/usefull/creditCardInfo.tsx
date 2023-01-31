import { CreditCard } from "../protocols";

let cardInfo : CreditCard;

export function setCardInfo(paymentInfo : CreditCard) {
  cardInfo = paymentInfo;
}

export function getCardInfo() : CreditCard {
  return cardInfo;
}

