"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = exports.getTradeMessages = void 0;
const errors_1 = require("../errors");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const message_repository_1 = __importDefault(require("../repositories/message-repository"));
async function getTradeMessages(tradeId, userId) {
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("EnrollmentNotFound");
    const tradeMessages = await message_repository_1.default.getTradeMessagesByTradeId(tradeId);
    return tradeMessages;
}
exports.getTradeMessages = getTradeMessages;
async function postMessage(userId, tradeId, text) {
    if (isNaN(tradeId))
        throw (0, errors_1.defaultError)("TradeNoutFound");
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("EnrollmentNotFound");
    const message = await message_repository_1.default.postMessage(text, enrollment.id);
    await message_repository_1.default.postTradeMessage(message.id, tradeId);
    return message;
}
exports.postMessage = postMessage;
const messagesService = {
    getTradeMessages,
    postMessage
};
exports.default = messagesService;
