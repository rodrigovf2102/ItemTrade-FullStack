import { Trade, TradeAvaliation, TradeInfo, TradePost } from "../protocols";
import api from "./api";

export async function getTrades(tradeInfo : TradeInfo, token:string) : Promise<Trade[]> {
  const response = await api.get(`trades/${tradeInfo.tradeType}?enrollmentId=${tradeInfo.enrollmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function postTrade(newTrade: TradePost, token: string) : Promise<Trade> {
  const response = await api.post("trades/purchase", newTrade, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function getTradeAvaliations(token: string) : Promise<TradeAvaliation[]> {
  const response = await api.get("trades/avaliations", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
}

export async function getTrade(tradeId: number, token:string) : Promise<Trade> {
  const response = await api.get(`trades/specific/${tradeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function updateTradeStatus(tradeId : number, token: string) : Promise<Trade> {
  const response = await api.put(`trades/complete/${tradeId}`, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data; 
}

