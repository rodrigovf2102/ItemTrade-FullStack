import filterSwearword from "@/assets/openai";
import { defaultError } from "@/errors";
import { ServerNoIdName } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import gameRepository from "@/repositories/game-repository";
import serverRepository from "@/repositories/server-repository";
import { Server } from "@prisma/client";

export async function getServers(gameId:number, filter:string): Promise<Server[]> {
  if(filter==="undefined") filter="";
  if(!filter) filter="";
  filter = filter.toUpperCase();
  if(isNaN(gameId)) throw defaultError("Invalid gameId");
  if(gameId===0) gameId=undefined;
  const servers = await serverRepository.findServersByGameId(gameId,filter);
  if(servers.length===0) throw defaultError("ServersNotFound");
  return servers;
}

export async function postServer({name,gameName}: ServerNoIdName, userId:number) : Promise<Server>{
  gameName=gameName.toUpperCase();
  name=name.toUpperCase().trim();
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("UserWithoutEnrollment");
  const game = await gameRepository.findGameByName(gameName);
  if(!game) throw defaultError("GameNameDoesntExist");
  const server = await serverRepository.findServerByNameAndGameId(name, game.id);
  if(server) throw defaultError("ServerAlreadyExist");

  const message = `Answer with one word ( yes or no ). Can the expression "${name}" be a swearword or a intimate body part or a inappropriate action to do in public?`;
  const response = await filterSwearword(message);

  if(response?.includes("Yes") && response) {
    throw defaultError("InvalidServerName");
  }

  const createdServer = await serverRepository.postServer({name, gameId: game.id});
  return createdServer;
}

const serversService = {
  getServers,
  postServer
};

export default serversService;