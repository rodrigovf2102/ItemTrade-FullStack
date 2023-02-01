import { Router } from "express";
import { validateBody } from "@/middlewares";
import { postPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { PaymentSchema } from "@/schemas";

const paymentRouter = Router();

paymentRouter.post("/", authenticateToken, validateBody(PaymentSchema) , postPayment);

export { paymentRouter };
