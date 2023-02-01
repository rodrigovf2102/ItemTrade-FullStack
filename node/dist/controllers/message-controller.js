"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeMessages = exports.postMessage = void 0;
const messagesService_1 = __importDefault(require("../services/messagesService"));
const http_status_1 = __importDefault(require("http-status"));
async function postMessage(req, res) {
    const { userId } = req;
    const { text, tradeId } = req.body;
    try {
        const message = await messagesService_1.default.postMessage(userId, tradeId, text);
        return res.status(http_status_1.default.CREATED).send(message);
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.postMessage = postMessage;
async function getTradeMessages(req, res) {
    const { userId } = req;
    const tradeId = Number(req.params.tradeId);
    try {
        const tradeMessages = await messagesService_1.default.getTradeMessages(tradeId, userId);
        return res.status(http_status_1.default.OK).send(tradeMessages);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getTradeMessages = getTradeMessages;
