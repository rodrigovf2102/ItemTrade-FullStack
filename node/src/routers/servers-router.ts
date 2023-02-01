import { Router } from "express";
import { serverSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { getServers, postServer } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";

const serversRouter = Router();

serversRouter.get("/:gameId", getServers);
serversRouter.post("/", validateBody(serverSchema), authenticateToken, postServer);

export { serversRouter };
