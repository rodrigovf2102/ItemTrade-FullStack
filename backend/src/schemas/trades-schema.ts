import {  TradePost } from "@/protocols";
import Joi from "joi";

export const tradeSchema = Joi.object<TradePost>({
  sellerEnrollmentId: Joi.number().required(),
  itemId: Joi.number().required()
});



