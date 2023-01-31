import { defaultError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import itemRepository from "@/repositories/item-repository";
import tradeRepository from "@/repositories/trade-repository";
import tradeAvaliationRepository from "@/repositories/tradeAvaliation";
import { OPERATIONTYPE, Trade, TradeAvaliation, TRADESTATUS } from "@prisma/client";

export async function postTrade(sellerEnrollmentId: number, userId: number, itemId: number): Promise<Trade> {
  const buyerEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  const sellerEnrollment = await enrollmentRepository.findEnrollmentById(sellerEnrollmentId);

  if (!buyerEnrollment || !sellerEnrollment) throw defaultError("UserEnrollmentNotFound");
  const item = await itemRepository.findItemsById(itemId);
  if (!item[0]) throw defaultError("ItemNotFound");

  if(buyerEnrollment.balance < item[0].price) throw defaultError("InsuficientBalance");
  const newBuyerBalance = buyerEnrollment.balance - item[0].price;
  const newSellerFreezeBalance = sellerEnrollment.freezedBalance + item[0].price;
  await enrollmentRepository.updateEnrollmentBalance(newBuyerBalance, buyerEnrollment.id);
  await enrollmentRepository.updateEnrollmentFreezedBalance(newSellerFreezeBalance, sellerEnrollment.id);

  if(buyerEnrollment.id===sellerEnrollmentId) throw defaultError("UserCantBuyFromHimself");

  const tradeTypeBuyer: OPERATIONTYPE = OPERATIONTYPE.PURCHASE;
  const tradeTypeSeller: OPERATIONTYPE = OPERATIONTYPE.SALE;

  await tradeAvaliationRepository.postTradeAvaliation(tradeTypeBuyer, buyerEnrollment.id);
  await tradeAvaliationRepository.postTradeAvaliation(tradeTypeSeller, sellerEnrollmentId);

  const trade = await tradeRepository.postTradeByEnrollmentsIds(sellerEnrollmentId, buyerEnrollment.id, itemId);
  await itemRepository.updateItemTradeStatusByIdAndBoolean(itemId,true);
  return trade;
}

export async function getTradesByUserIdOrEnrollId(userId: number, tradeType: string, enrollmentId: number): Promise<Trade[]> {
  if (tradeType !== OPERATIONTYPE.PURCHASE && tradeType !== OPERATIONTYPE.SALE) {
    throw defaultError("InvalidTradeType");
  }
  let enrollment;
  if(isNaN(enrollmentId)) enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if(!isNaN(enrollmentId)) enrollment = await enrollmentRepository.findEnrollmentById(enrollmentId);
  if (!enrollment) throw defaultError("UserEnrollmentNotFound");
  let trades;
  if (tradeType === OPERATIONTYPE.PURCHASE) {
    trades = await tradeRepository.findTradesByBuyerEnrollmentId(enrollment.id);
    return trades;
  }
  trades = await tradeRepository.findTradesBySellerEnrollmentId(enrollment.id);
  return trades;
}

export async function getTradeAvaliations(userId:number) : Promise<TradeAvaliation[]>{
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("UserEnrollmentNotFound");

  const tradeAvaliations = await tradeAvaliationRepository.getTradeAvaliations(enrollment.id);
  return tradeAvaliations;
}

export async function getTradeById(tradeId: number, userId: number) : Promise<Trade>{
  if(isNaN(tradeId)) throw defaultError("InvalidTradeId");

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("UserEnrollmentNotFound");

  const trade = await tradeRepository.getTradeByTradeId(tradeId);

  if(trade.buyerEnrollmentId !== enrollment.id && trade.sellerEnrollmentId !== enrollment.id){
    throw defaultError("NotATradeMenber");
  }
  return trade;
}

export async function updateTradeStatus(userId : number, tradeId : number) : Promise<Trade>{
  let updatedTrade : Trade;
  if(isNaN(tradeId)) throw defaultError("InvalidTradeId");

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("UserEnrollmentNotFound");

  const trade = await tradeRepository.getTradeByTradeId(tradeId);
  if(trade.buyerEnrollmentId !== enrollment.id && trade.sellerEnrollmentId !== enrollment.id){
    throw defaultError("NotATradeMember"); 
  }

  if(trade.buyerEnrollmentId === enrollment.id){
    updatedTrade = await tradeRepository.updateTradeBuyerStatus(tradeId);
  }
  if(trade.sellerEnrollmentId === enrollment.id){
    updatedTrade = await tradeRepository.updateTradeSellerStatus(tradeId);
  }
  if(updatedTrade.buyerStatus === TRADESTATUS.COMPLETE && updatedTrade.sellerStatus === TRADESTATUS.COMPLETE){
    updatedTrade = await tradeRepository.updateTradeStatus(tradeId);
    const sellerEnroll = await enrollmentRepository.findEnrollmentById(trade.sellerEnrollmentId);
    sellerEnroll.freezedBalance -=  trade.Item.price;
    sellerEnroll.balance += trade.Item.price;
    
    await enrollmentRepository.updateEnrollmentBalance(sellerEnroll.balance, sellerEnroll.id);
    await enrollmentRepository.updateEnrollmentFreezedBalance(sellerEnroll.freezedBalance, sellerEnroll.id);

  }
  return updatedTrade;
}



const tradeService = {
  postTrade,
  getTradesByUserIdOrEnrollId,
  getTradeAvaliations,
  getTradeById,
  updateTradeStatus
};

export default tradeService;
