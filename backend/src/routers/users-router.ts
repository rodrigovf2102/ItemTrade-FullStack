import { Router } from "express";
import { createUserSchema, signInSchema, signInTokenSchema } from "@/schemas";
import { authenticateToken, validateBody } from "@/middlewares";
import { usersPost, signInPost, signInToken } from "@/controllers";

const usersRouter = Router();

usersRouter.post("/signup", validateBody(createUserSchema), usersPost);
usersRouter.post("/signin", validateBody(signInSchema), signInPost);
usersRouter.post("/signinToken", validateBody(signInTokenSchema), signInToken);

export { usersRouter };
