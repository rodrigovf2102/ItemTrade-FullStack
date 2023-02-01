import { UpsertEnrollment, Amount } from "@/protocols";
import Joi from "joi";

export const upsertEnrollmentSchema = Joi.object<UpsertEnrollment>({
  name: Joi.string().min(3).required(),
  CPF: Joi.string().min(11).max(11).required(),
  enrollmentUrl: Joi.alternatives().try(Joi.string().pattern(new RegExp("^https://")).required())
                                   .try(Joi.string().pattern(new RegExp("^data:image")).required()),
});

export const updateEnrollmentSchema = Joi.object<Amount>({
  amount: Joi.number().required(),
  paymentHash: Joi.string().required()
});



