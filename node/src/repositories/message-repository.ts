import { prisma } from "@/config";
import { Message, TradeMessage } from "@prisma/client";

export async function getTradeMessagesByTradeId(tradeId: number): Promise<TradeMessage[]> {
  return prisma.tradeMessage.findMany({
    where: { tradeId },
    include: { Message: true, Trade: true },
  });
}

export async function postMessage(text: string, enrollmentId: number): Promise<Message> {
  return prisma.message.create({
    data: { text, enrollmentId },
  });
}

export async function postTradeMessage(messageId: number, tradeId: number): Promise<TradeMessage> {
  return prisma.tradeMessage.create({
    data: { messageId, tradeId },
  });
}

const messageRepository = {
  getTradeMessagesByTradeId,
  postMessage,
  postTradeMessage
};

export default messageRepository;
