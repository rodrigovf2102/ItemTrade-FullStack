import { prisma } from "@/config";
import { OPERATIONTYPE, TradeAvaliation } from "@prisma/client";

export async function postTradeAvaliation(tradeType: OPERATIONTYPE, enrollmentId : number) : Promise<TradeAvaliation> {
  return prisma.tradeAvaliation.create({
    data: { tradeType, enrollmentId }
  });
}

export async function getTradeAvaliations(enrollmentId: number) : Promise<TradeAvaliation[]>{
  return prisma.tradeAvaliation.findMany({
    where: { enrollmentId }
  });
}

const tradeAvaliationRepository = {
  postTradeAvaliation,
  getTradeAvaliations
};

export default tradeAvaliationRepository;