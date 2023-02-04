import { Router } from "express";
import { itemSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { getItems, postItem } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";

const itemsRouter = Router();

itemsRouter.get("/:serverId", getItems);
itemsRouter.post("/", validateBody(itemSchema), authenticateToken, postItem);

export { itemsRouter };
