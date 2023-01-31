import { prisma } from "@/config";
import { GameWithNoId } from "@/protocols";
import { Game } from "@prisma/client";

export async function findGames(filter:string): Promise<Game[]> {
  return prisma.game.findMany({
    where:{name:{contains:filter}},
    take: 30
  });
}

export async function findGameByName(name: string): Promise<Game> {
  return prisma.game.findFirst({
    where: { name },
  });
}

export async function postGame({ name, gameUrl }: GameWithNoId): Promise<Game> {
  return prisma.game.create({
    data: { name, gameUrl },
  });
}

const gameRepository = {
  findGames,
  postGame,
  findGameByName
};

export default gameRepository;
