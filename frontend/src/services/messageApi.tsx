import { Message, MessagePost, MessageText, TradeMessage } from "../protocols";
import api from "./api";

export async function getTradeMessages(tradeId:number, token: string) : Promise<TradeMessage[]> {
  const response = await api.get(`/messages/${tradeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function postMessage(postMessage : MessagePost, token: string) : Promise<Message> {
  const response = await api.post("/messages", postMessage, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};
