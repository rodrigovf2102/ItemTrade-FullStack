import {  MessagePost } from "@/protocols";
import Joi from "joi";

export const messagesSchema = Joi.object<MessagePost>({
  text: Joi.string().required(),
  tradeId: Joi.number().required()
});



