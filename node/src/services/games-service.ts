import filterSwearword from "@/assets/openai";
import { defaultError } from "@/errors";
import { GameWithNoId } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import gameRepository from "@/repositories/game-repository";
import { Game } from "@prisma/client";

export async function getGames(filter:string): Promise<Game[]> {
  if(filter==="undefined") filter="";
  if(!filter) filter = "";
  filter = filter.toUpperCase();
  const games = await gameRepository.findGames(filter);
  if(games.length===0) throw defaultError("GamesNotFound");
  return games;
}

export async function postGame({name,gameUrl}: GameWithNoId, userId: number) : Promise<Game>{
  name=name.toUpperCase().trim();
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("UserWithoutEnrollment");
  const game = await gameRepository.findGameByName(name);
  if(game) throw defaultError("GameAlreadyExist");
  name = name.toUpperCase();

  const message = `online game "${name}" exists? answer with one word ( yes or no )`;
  const response = await filterSwearword(message);
  if(!response?.includes("Yes") && response) {
    throw defaultError("InvalidGameName");
  }

  const createdGame = await gameRepository.postGame({name,gameUrl});
  return createdGame;
}

const gamesService = {
  getGames,
  postGame
};

export default gamesService;