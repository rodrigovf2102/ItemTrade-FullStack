import { prisma } from "@/config";
import { ServerWithNoId } from "@/protocols";
import { Server } from "@prisma/client";

export async function findServersByGameId(gameId : number, filter: string): Promise<Server[]> {
  return prisma.server.findMany({
    where: { gameId, name: { contains: filter } },
    include: {Game:true},
    take: 30
  });
}

export async function findServerById(serverId : number): Promise<Server> {
  return prisma.server.findFirst({
    where: { id: serverId },
  });
}

export async function findServerByName(name: string): Promise<Server> {
  return prisma.server.findFirst({
    where: { name },
  });
}

export async function findServerByNameAndGameId(name: string, gameId:number): Promise<Server> {
  return prisma.server.findFirst({
    where: { name, gameId },
  });
}

export async function postServer({ name, gameId }: ServerWithNoId) : Promise<Server>{
  return prisma.server.create({
    data: { name, gameId },
  });
}

const serverRepository = {
  findServersByGameId,
  postServer,
  findServerByName,
  findServerById,
  findServerByNameAndGameId
};

export default serverRepository;
