import { ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName } from "@/protocols";
import Joi from "joi";

export const itemSchema = Joi.object<ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName>({
  name: Joi.string().min(4).max(70).required(),
  price: Joi.number().required(),
  amount: Joi.number().required(),
  itemUrl: Joi.alternatives().try(Joi.string().pattern(new RegExp("^https://")).required())
                             .try(Joi.string().pattern(new RegExp("^data:image")).required()),
  gameName: Joi.string().required(),
  serverName : Joi.string().required(),
  itemType : Joi.any().allow("Dinheiro","Equipamento","Recurso","Utilizavel","Outros","Raros"),
});

