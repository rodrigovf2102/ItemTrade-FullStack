import { ServerWithGame, ServerWithNoId } from "@/protocols";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Server } from "@prisma/client";

export async function createServer(gameId : number) : Promise<Server>{
  const server : ServerWithNoId= {
    gameId,
    name : faker.name.firstName().toUpperCase(),
  };

  return prisma.server.create({
    data: server,
  });
}

export async function createServerWithGame(gameId : number) : Promise<ServerWithGame>{
  const server : ServerWithNoId= {
    gameId,
    name : faker.name.firstName().toUpperCase(),
  };

  return prisma.server.create({
    data: server,
    include: {Game: true}
  });
}