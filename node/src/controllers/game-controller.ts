import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import gamesService from "@/services/games-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getGames(req: Request, res: Response) {
  const filter = req.query.filter as string;
  try {
    const games = await gamesService.getGames(filter);
    return res.status(httpStatus.OK).send(games);
  } catch (error) {
    if (error.detail === "GamesNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function postGame(req: AuthenticatedRequest, res: Response) {
  const { name, gameUrl } = req.body;
  const {userId} = req;
  try {
    const game = await gamesService.postGame({ name, gameUrl }, userId);
    return res.status(httpStatus.CREATED).send(game);
  } catch (error) {
    if (error.detail === "GamesAlreadyExist") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    if (error.detail === "UserWithoutEnrollment") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
