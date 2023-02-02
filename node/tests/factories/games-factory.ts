import { GameWithNoId } from "@/protocols";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Game } from "@prisma/client";

export async function createGame() : Promise<Game>{
  const game : GameWithNoId = {
    name : faker.name.firstName().toUpperCase(),
    gameUrl : faker.image.imageUrl(undefined,undefined,undefined,true,true),
  };

  return prisma.game.create({
    data: game
  });
}

export async function createGameWithName(gameName: string) : Promise<Game>{
  const game : GameWithNoId = {
    name : gameName.toUpperCase(),
    gameUrl : faker.image.imageUrl(undefined,undefined,undefined,true,true),
  };

  return prisma.game.create({
    data: game
  });
}