import { ServerNoIdName } from "@/protocols";
import Joi from "joi";

export const serverSchema = Joi.object<ServerNoIdName>({
  name: Joi.string().min(3).required(),
  gameName: Joi.string().required()
});



