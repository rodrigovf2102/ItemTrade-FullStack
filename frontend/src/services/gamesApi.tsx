import { GameWithoutId } from "../protocols";
import api from "./api";
import { Game } from "../protocols";

export async function getGames(filter: string) : Promise<Game[]> {
  const response = await api.get(`/games?filter=${filter}`);
  return response.data;
};

export async function postGame(newGame: GameWithoutId, token: string) : Promise<Game> {
  const response = await api.post("/games", newGame, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

