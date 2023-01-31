import { defaultError } from "@/errors";
import { PaymentPost, PaymentWithNoId } from "@/protocols";
import { Payments } from "@prisma/client";
import paymentRepository from "@/repositories/payment-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { v4 as uuidv4 } from "uuid";

export async function postPayment(payment: PaymentPost, userId:number): Promise<Payments> {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("EnrollmentNotFound");
  const paymentHash = uuidv4();
  const paymentPost : PaymentWithNoId = {...payment, enrollmentId:enrollment.id, paymentHash: paymentHash};
  
  const postedPayment = await paymentRepository.postPayment(paymentPost);
  return postedPayment;
}

const paymentService = {
  postPayment
};

export default paymentService;