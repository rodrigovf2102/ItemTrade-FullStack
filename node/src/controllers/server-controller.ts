import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import serversService from "@/services/servers-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getServers(req: Request, res: Response) {
  try {
    const gameId = Number(req.params.gameId);
    const filter = req.query.filter as string;
    const servers = await serversService.getServers(gameId, filter);
    return res.status(httpStatus.OK).send(servers);
  } catch (error) {
    if (error.detail === "ServersNotFound") {"";
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function postServer(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { name, gameName } = req.body;
  try {
    const server = await serversService.postServer({ name, gameName }, userId );
    return res.status(httpStatus.CREATED).send(server);
  } catch (error) {
    if (error.detail === "ServerAlreadyExist") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    if (error.detail === "UserWithoutEnrollment") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    if (error.detail === "GameNameDoesntExist") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
