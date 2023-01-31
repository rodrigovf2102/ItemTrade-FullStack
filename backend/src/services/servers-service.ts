import { defaultError } from "@/errors";
import { ServerNoIdName } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import gameRepository from "@/repositories/game-repository";
import serverRepository from "@/repositories/server-repository";
import { Server } from "@prisma/client";

export async function getServers(gameId:number, filter:string): Promise<Server[]> {
  if(filter==="undefined") filter="";
  filter = filter.toUpperCase();
  if(isNaN(gameId)) throw defaultError("Invalid gameId");
  if(gameId===0) gameId=undefined;
  const servers = await serverRepository.findServersByGameId(gameId,filter);
  return servers;
}

export async function postServer({name,gameName}: ServerNoIdName, userId:number) : Promise<Server>{
  gameName=gameName.toUpperCase();
  name=name.toUpperCase();
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("UserWithoutEnrollment");
  const server = await serverRepository.findServerByName(name);
  if(server) throw defaultError("ServerAlreadyExist");
  const game = await gameRepository.findGameByName(gameName);
  if(!game) throw defaultError("GameNameDoesntExist");
  const createdServer = await serverRepository.postServer({name, gameId: game.id});
  return createdServer;
}

const serversService = {
  getServers,
  postServer
};

export default serversService;