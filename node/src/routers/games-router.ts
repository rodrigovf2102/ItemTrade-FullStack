import { Router } from "express";
import { createGameSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { getGames, postGame } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";

const gamesRouter = Router();

gamesRouter.get("/", getGames);
gamesRouter.post("/", authenticateToken, validateBody(createGameSchema),postGame);

export { gamesRouter };
