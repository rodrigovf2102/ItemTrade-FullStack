import { PaymentPost } from "@/protocols";
import Joi from "joi";

export const PaymentSchema = Joi.object<PaymentPost>({
  creditCardLastDigits: Joi.string().min(4).max(4).required(),
  cardIssuer: Joi.string().max(40).required(),
  cardName: Joi.string().max(100).required(),
  value: Joi.number().min(100).required()
});



