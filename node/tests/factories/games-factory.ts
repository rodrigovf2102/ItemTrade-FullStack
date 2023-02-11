import { GameWithNoId } from "@/protocols";
import { faker } from "@faker-js/faker";
import { prisma } from "@/config";
import { Game } from "@prisma/client";

export async function createGame(gameName : string = undefined) : Promise<Game>{
  const game : GameWithNoId = {
    name : gameName || faker.name.firstName().toUpperCase(),
    gameUrl : faker.image.imageUrl(undefined,undefined,undefined,true),
  };

  return prisma.game.create({
    data: game
  });
}