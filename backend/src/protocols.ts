import { Session, User, Game, Server, Item, ITEMTYPE, Payments, Trade, Message, Enrollment, TRADESTATUS } from "@prisma/client";

export type UserWithNoId = Omit<User, "id">;

export type ApplicationError = {
    name: string;
    message: string;
};

export type UserWithEmailAndToken = {
    email: string,
    token: string
};

export type UserWithEmailTokenAndId = {
    email: string,
    token: string,
    id: number
};

export type UserWithIdAndToken = {
    id: number,
    token: string
};

export type SessionWithNoId = Omit<Session, "id">;

export type GameWithNoId = Omit<Game, "id">;

export type UpsertEnrollment = {
    name: string,
    CPF: string,
    enrollmentUrl?: string
};

export type ServerWithNoId = Omit<Server, "id">;

export type ServerNoIdName = {
    name: string,
    gameName: string
}

export type ItemWithNoId = Omit<Item, "id"|"inTrade">

export type ItemWithNoIdNoEnrollId = Omit<Item,"id"|"enrollmentId"|"inTrade">

export type ItemWithNoIdNoEnrollIdNoGameId = Omit<Item,"id"|"enrollmentId"|"gameId"|"inTrade">

export type ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName = {
    name: string,
    price: number,
    amount: number,
    itemUrl: string,
    gameName: string,
    serverName: string,
    itemType: ITEMTYPE
  }

export type Amount = {
    amount : number,
    paymentHash: string
}

export type PaymentPost = Omit<Payments,"id"|"enrollmentId"|"paymentHash">

export type PaymentWithNoId = Omit<Payments,"id">

export type PaymentNoIdNoEnrolId = Omit<Payments,"id"|"enrollmentId">

export type TradePost = Pick<Trade, "sellerEnrollmentId" | "itemId">

export type MessagePost ={
    text: string,
    tradeId:number
}
export type TradeWithEnrollsItem = {
    id: number;
    sellerEnrollmentId: number;
    EnrollmentBuyer: Enrollment,
    EnrollmentSeller: Enrollment,
    Item: Item,
    buyerEnrollmentId: number;
    sellerStatus: TRADESTATUS;
    buyerStatus: TRADESTATUS;
    tradeStatus: TRADESTATUS;
    itemId: number;
  
  }
