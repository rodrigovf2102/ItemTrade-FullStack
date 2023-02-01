import { AuthenticatedRequest } from "@/middlewares";
import tradeService from "@/services/trades-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postTrade(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { sellerEnrollmentId, itemId } = req.body;

  try {
    const trade = await tradeService.postTrade(sellerEnrollmentId, userId, itemId);
    return res.status(httpStatus.CREATED).send(trade);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getTradesByUserIdOrEnrollId(req: AuthenticatedRequest, res: Response){
  const { userId } = req;
  const enrollmentId = Number(req.query.enrollmentId);
  const tradeType = req.params.tradeType;
  try {
    const trades = await tradeService.getTradesByUserIdOrEnrollId(userId, tradeType, enrollmentId);
    return res.status(httpStatus.OK).send(trades);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getTradeAvaliations(req: AuthenticatedRequest, res: Response){
  const { userId } = req;
  try {
    const tradeAvaliations = await tradeService.getTradeAvaliations(userId);
    return res.status(httpStatus.OK).send(tradeAvaliations);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getTrade(req: AuthenticatedRequest, res: Response){
  const {userId } = req;
  const tradeId = Number(req.params.tradeId);
  try {
    const trade = await tradeService.getTradeById(tradeId, userId);
    return res.status(httpStatus.OK).send(trade);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function updateTradeStatus(req: AuthenticatedRequest, res: Response){
  const { userId } = req;
  const tradeId = Number(req.params.tradeId);
  try {
    const updatedTrade = await tradeService.updateTradeStatus(userId, tradeId);
    return res.status(httpStatus.OK).send(updatedTrade);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);   
  }
}