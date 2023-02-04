import { Item, ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName } from "../protocols";
import api from "./api";

export async function getItems(serverId: number, type:string, filter: string, itemId:string) : Promise<Item[]> {
  const response = await api.get(`/items/${serverId}?filter=${filter}&itemId=${itemId}&type=${type}`);
  return response.data;
};

export async function postItem(newItem: ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, token: string) : Promise<Item> {
  const response = await api.post("/items", newItem, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

