import { prisma } from "@/config";
import { TradeWithEnrollsItem } from "@/protocols";
import { Trade, TRADESTATUS } from "@prisma/client";

export async function postTradeByEnrollmentsIds(sellerEnrollmentId : number, buyerEnrollmentId : number, itemId : number) : Promise<TradeWithEnrollsItem> {
  return prisma.trade.create({
    data: { sellerEnrollmentId, buyerEnrollmentId, itemId},
    include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true}
  });
}

export async function getTradeByTradeId(tradeId: number) : Promise<TradeWithEnrollsItem>{
  return prisma.trade.findFirst({
    where:{id:tradeId},
    include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true}
  });
}

export async function findTradesByBuyerEnrollmentId(enrollmentId : number) : Promise<Trade[]>{
  return prisma.trade.findMany({
    where : { buyerEnrollmentId : enrollmentId},
    orderBy: { id: "desc" },
    include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true}
  });
}

export async function findTradesBySellerEnrollmentId(enrollmentId : number) : Promise<Trade[]>{
  return prisma.trade.findMany({
    where : { sellerEnrollmentId : enrollmentId},
    orderBy: { id: "desc" },
    include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true}
  });
}

export async function updateTradeStatus(tradeId: number) : Promise<Trade>{
  return prisma.trade.update({
    where:{id:tradeId},
    data:{tradeStatus: TRADESTATUS.COMPLETE}
  });
}

export async function updateTradeBuyerStatus(tradeId: number) : Promise<Trade>{
  return prisma.trade.update({
    where:{id:tradeId},
    data:{buyerStatus: TRADESTATUS.COMPLETE}
  });
}

export async function updateTradeSellerStatus(tradeId: number) : Promise<Trade>{
  return prisma.trade.update({
    where:{id:tradeId},
    data:{sellerStatus: TRADESTATUS.COMPLETE}
  });
}

const tradeRepository = {
  postTradeByEnrollmentsIds,
  findTradesByBuyerEnrollmentId,
  findTradesBySellerEnrollmentId,
  getTradeByTradeId,
  updateTradeStatus,
  updateTradeBuyerStatus,
  updateTradeSellerStatus
};

export default tradeRepository;