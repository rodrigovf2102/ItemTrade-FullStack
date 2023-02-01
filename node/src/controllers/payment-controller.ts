import { AuthenticatedRequest } from "@/middlewares";
import { PaymentPost } from "@/protocols";
import paymentService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const paymentPost = req.body as PaymentPost;
    const postedPayment = await paymentService.postPayment(paymentPost,userId);
    return res.status(httpStatus.OK).send(postedPayment);
  } catch (error) {
    if (error.detail === "EnrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}