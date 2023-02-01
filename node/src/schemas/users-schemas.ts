import { SessionWithNoId, UserWithNoId } from "@/protocols";
import Joi from "joi";

export const createUserSchema = Joi.object<UserWithNoId>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object<UserWithNoId>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInTokenSchema = Joi.object<SessionWithNoId>({
  userId: Joi.number().required(),
  token: Joi.string().required(),
});
