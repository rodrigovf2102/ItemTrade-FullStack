import { defaultError } from "@/errors";
import { Amount, UpsertEnrollment } from "@/protocols";
import { Enrollment } from "@prisma/client";
import { isValidCPF } from "@brazilian-utils/brazilian-utils";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentRepository from "@/repositories/payment-repository";

export async function getEnrollment(userId:number): Promise<Enrollment> {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("EnrollmentNotFound");
  return enrollment;
}

export async function upsertEnrollment(newEnrollment: UpsertEnrollment, userId:number): Promise<Enrollment>{
  if(!isValidCPF(newEnrollment.CPF)) throw defaultError("InvalidCPF");
  let enrollment = await enrollmentRepository.findEnrollmentByCPF(newEnrollment.CPF);
  if(enrollment) throw defaultError("CPFAlreadyExists");
  if(!newEnrollment.enrollmentUrl) newEnrollment.enrollmentUrl = "../assets/images/action.jpg";
  enrollment = await enrollmentRepository.upsertEnrollment(newEnrollment,userId);
  return enrollment;
}

export async function updateEnrollmentBalance(amountInfo: Amount, userId:number):Promise<Enrollment>{
  if(isNaN(amountInfo.amount)) throw defaultError("InvalidamountInfo");
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw defaultError("EnrollmentNotFound");
  const payment = await paymentRepository.getPaymentByHash(amountInfo.paymentHash);
  if(!payment && amountInfo.amount > 0) throw defaultError("PaymentNotFound");
  amountInfo.amount = enrollment.balance + amountInfo.amount;
  const enrollmentUpdated = await enrollmentRepository.updateEnrollmentBalance(amountInfo.amount,enrollment.id);
  return enrollmentUpdated; 
}

const enrollmentService = {
  getEnrollment,
  upsertEnrollment,
  updateEnrollmentBalance
};

export default enrollmentService;