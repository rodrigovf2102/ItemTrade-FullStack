import { prisma } from "@/config";
import { PaymentWithNoId } from "@/protocols";
import { Payments,} from "@prisma/client";


export async function postPayment(paymentPost : PaymentWithNoId): Promise<Payments> {
    return prisma.payments.create({
      data: paymentPost
    });
}

export async function getPaymentByHash(paymentHash:string) : Promise<Payments>{
  return prisma.payments.findFirst({
    where: { paymentHash }
  });
}


const paymentRepository = {
  postPayment,
  getPaymentByHash
};

export default paymentRepository;