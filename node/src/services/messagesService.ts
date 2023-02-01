import { defaultError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import messageRepository from "@/repositories/message-repository";
import { Message, TradeMessage } from "@prisma/client";

export async function getTradeMessages(tradeId: number, userId: number): Promise<TradeMessage[]> {

  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("EnrollmentNotFound");

  const tradeMessages = await messageRepository.getTradeMessagesByTradeId(tradeId);

  return tradeMessages;
}

export async function postMessage(userId: number, tradeId: number, text: string): Promise<Message> {
  if (isNaN(tradeId)) throw defaultError("TradeNoutFound");
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("EnrollmentNotFound");

  const message = await messageRepository.postMessage(text, enrollment.id);
  await messageRepository.postTradeMessage(message.id, tradeId);

  return message;
}

const messagesService = {
  getTradeMessages,
  postMessage
};

export default messagesService;
