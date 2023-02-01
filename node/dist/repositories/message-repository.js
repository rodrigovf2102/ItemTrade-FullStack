"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTradeMessage = exports.postMessage = exports.getTradeMessagesByTradeId = void 0;
const config_1 = require("../config");
async function getTradeMessagesByTradeId(tradeId) {
    return config_1.prisma.tradeMessage.findMany({
        where: { tradeId },
        include: { Message: true, Trade: true },
    });
}
exports.getTradeMessagesByTradeId = getTradeMessagesByTradeId;
async function postMessage(text, enrollmentId) {
    return config_1.prisma.message.create({
        data: { text, enrollmentId },
    });
}
exports.postMessage = postMessage;
async function postTradeMessage(messageId, tradeId) {
    return config_1.prisma.tradeMessage.create({
        data: { messageId, tradeId },
    });
}
exports.postTradeMessage = postTradeMessage;
const messageRepository = {
    getTradeMessagesByTradeId,
    postMessage,
    postTradeMessage
};
exports.default = messageRepository;
