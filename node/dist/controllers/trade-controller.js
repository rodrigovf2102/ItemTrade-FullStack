"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradeStatus = exports.getTrade = exports.getTradeAvaliations = exports.getTradesByUserIdOrEnrollId = exports.postTrade = void 0;
const trades_service_1 = __importDefault(require("../services/trades-service"));
const http_status_1 = __importDefault(require("http-status"));
async function postTrade(req, res) {
    const { userId } = req;
    const { sellerEnrollmentId, itemId } = req.body;
    try {
        const trade = await trades_service_1.default.postTrade(sellerEnrollmentId, userId, itemId);
        return res.status(http_status_1.default.CREATED).send(trade);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.postTrade = postTrade;
async function getTradesByUserIdOrEnrollId(req, res) {
    const { userId } = req;
    const enrollmentId = Number(req.query.enrollmentId);
    const tradeType = req.params.tradeType;
    try {
        const trades = await trades_service_1.default.getTradesByUserIdOrEnrollId(userId, tradeType, enrollmentId);
        return res.status(http_status_1.default.OK).send(trades);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getTradesByUserIdOrEnrollId = getTradesByUserIdOrEnrollId;
async function getTradeAvaliations(req, res) {
    const { userId } = req;
    try {
        const tradeAvaliations = await trades_service_1.default.getTradeAvaliations(userId);
        return res.status(http_status_1.default.OK).send(tradeAvaliations);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getTradeAvaliations = getTradeAvaliations;
async function getTrade(req, res) {
    const { userId } = req;
    const tradeId = Number(req.params.tradeId);
    try {
        const trade = await trades_service_1.default.getTradeById(tradeId, userId);
        return res.status(http_status_1.default.OK).send(trade);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getTrade = getTrade;
async function updateTradeStatus(req, res) {
    const { userId } = req;
    const tradeId = Number(req.params.tradeId);
    try {
        const updatedTrade = await trades_service_1.default.updateTradeStatus(userId, tradeId);
        return res.status(http_status_1.default.OK).send(updatedTrade);
    }
    catch (error) {
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.updateTradeStatus = updateTradeStatus;
