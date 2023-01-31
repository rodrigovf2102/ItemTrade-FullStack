import { AuthenticatedRequest } from "@/middlewares";
import messagesService from "@/services/messagesService";
import { Response } from "express";
import httpStatus from "http-status";

export async function postMessage(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { text, tradeId } = req.body;
  try {
    const message = await messagesService.postMessage(userId,tradeId,text);
    return res.status(httpStatus.CREATED).send(message);
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getTradeMessages(req: AuthenticatedRequest, res: Response){
  const { userId } = req;
  const tradeId = Number(req.params.tradeId);
  try {
    const tradeMessages = await messagesService.getTradeMessages(tradeId, userId);
    return res.status(httpStatus.OK).send(tradeMessages);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}