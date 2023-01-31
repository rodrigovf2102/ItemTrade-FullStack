import { GameWithNoId } from "@/protocols";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Game } from "@prisma/client";

export async function createGame() : Promise<Game>{
  const game : GameWithNoId = {
    name : faker.name.firstName(),
    gameUrl : faker.image.imageUrl(undefined,undefined,undefined,undefined,true),
  };

  return prisma.game.create({
    data: game
  });
}