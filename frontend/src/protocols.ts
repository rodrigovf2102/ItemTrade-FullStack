import { ReactNode } from "react";

export type Game = {
  id: number,
  name: string,
  gameUrl: string
}

export type Server = {
  id: number,
  gameId: number,
  name: string
}

export type Item = {
  id: number,
  name: string,
  price: number,
  amount: number,
  itemUrl: string,
  serverId: number,
  enrollmentId: number,
  gameId: number,
  itemType: string,
  inTrade: boolean
};

export type Enrollment = {
  id: number,
  name: string,
  CPF: string,
  userId: number,
  balance: number,
  enrollmentUrl: string | undefined,
  freezedBalance: number
}

export type EnrollmentPost = Omit<Enrollment, "id"|"userId"|"balance"|"freezedBalance">

export type UserWithNoId = {
  email: string;
  password: string;
};

export type UserWithNoIdSignUp = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserWithEmailAndToken = {
  email: string;
  token: string;
};

export type UserWithEmailTokenAndId = {
  id: number;
  email: string;
  token: string;
};

export type GameWithoutId = Omit<Game, "id">;

export type ServerWithNoId = Omit<Server, "id">

export type ServerWithGame = {
  Game: Game,
  id: number,
  gameId: number,
  name: string
}

export type ServerNoIdName = {
  name: string,
  gameName: string
}

export type ItemWithNoIdNoEnrollId = Omit<Item, "id" | "enrollmentId"|"inTrade">

export type ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName = {
  name: string,
  price: number,
  amount: number,
  itemUrl: string,
  gameName: string,
  serverName: string,
  itemType: string
} 

export type ItemWithGameServerEnroll = {
  id: number,
  name: string,
  price: number,
  amount: number,
  itemUrl: string,
  serverId: number,
  enrollmentId: number,
  gameId: number,
  itemType: string,
  Game: Game,
  Server: Server,
  Enrollment: Enrollment,
  inTrade: boolean
}

export type ApplicationError = {
  name: string;
  message: string;
};

export interface ChildrenProps {
  children: ReactNode;
}

export type ObjectWithName = {
  name: string
}

export type ItemWithNameAndType = {
  name: string,
  itemType: string
}

export type GameInfo = {
  gameName:string,
  serverName:string
}

export type CreditCard = {
  name: string,
  issuer: string,
  number: string,
  expiry: string,
  cvc: string
}

export type Amount = {
  amount: number,
  paymentHash: string
}

export type Payments = {
  id: number
  creditCardLastDigits: string
  cardIssuer: string
  cardName: string
  enrollmentId: number,
  paymentHash:string,
  value: number
}

export type PaymentPost = Omit<Payments, "id"|"enrollmentId"|"paymentHash">

export type PaymentWithNoId = Omit<Payments, "id">

export type Trade = {
  id: number;
  sellerEnrollmentId: number;
  buyerEnrollmentId: number;
  sellerStatus: string;
  buyerStatus: string;
  tradeStatus: string;
  itemId: number;
}

export type TradePost = Pick<Trade, "sellerEnrollmentId" | "itemId">

export type TradeInfo = {
  tradeType: string,
  enrollmentId: number | undefined
}

export type TradeAvaliation = {
  id: number,
  tradeType: string,
  tradeStatus: string,
  enrollmentId: number
}

export type TradeWithEnrollsItem = {
  id: number;
  sellerEnrollmentId: number;
  EnrollmentBuyer: Enrollment,
  EnrollmentSeller: Enrollment,
  Item: Item,
  buyerEnrollmentId: number;
  sellerStatus: string;
  buyerStatus: string;
  tradeStatus: string;
  itemId: number;

}

export type Message = {
  id: number
  text: string
  date: string
  enrollmentId: number
}

export type TradeMessage = {
  id: number,
  messageId: number,
  tradeId: number,
  Message: Message,
  Trade: Trade
}

export type MessageText = Pick<Message, "text">

export type TradeMessageWithTradeId = Pick<TradeMessage, "tradeId">

export type MessagePost = {
  text: string,
  tradeId: number
}
