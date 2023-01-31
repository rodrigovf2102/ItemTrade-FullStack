import { Server, ServerNoIdName } from "../protocols";
import api from "./api";

export async function getServers(gameId: number, filter:string) : Promise<Server[]> {
  const response = await api.get(`/servers/${gameId}?filter=${filter}`);
  return response.data;
};

export async function postServer(newServer: ServerNoIdName, token: string) : Promise<Server> {
  const response = await api.post("/servers", newServer, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

