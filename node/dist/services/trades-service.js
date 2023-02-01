"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradeStatus = exports.getTradeById = exports.getTradeAvaliations = exports.getTradesByUserIdOrEnrollId = exports.postTrade = void 0;
const errors_1 = require("../errors");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const item_repository_1 = __importDefault(require("../repositories/item-repository"));
const trade_repository_1 = __importDefault(require("../repositories/trade-repository"));
const tradeAvaliation_1 = __importDefault(require("../repositories/tradeAvaliation"));
const client_1 = require("@prisma/client");
async function postTrade(sellerEnrollmentId, userId, itemId) {
    const buyerEnrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    const sellerEnrollment = await enrollment_repository_1.default.findEnrollmentById(sellerEnrollmentId);
    if (!buyerEnrollment || !sellerEnrollment)
        throw (0, errors_1.defaultError)("UserEnrollmentNotFound");
    const item = await item_repository_1.default.findItemsById(itemId);
    if (!item[0])
        throw (0, errors_1.defaultError)("ItemNotFound");
    if (buyerEnrollment.balance < item[0].price)
        throw (0, errors_1.defaultError)("InsuficientBalance");
    const newBuyerBalance = buyerEnrollment.balance - item[0].price;
    const newSellerFreezeBalance = sellerEnrollment.freezedBalance + item[0].price;
    await enrollment_repository_1.default.updateEnrollmentBalance(newBuyerBalance, buyerEnrollment.id);
    await enrollment_repository_1.default.updateEnrollmentFreezedBalance(newSellerFreezeBalance, sellerEnrollment.id);
    if (buyerEnrollment.id === sellerEnrollmentId)
        throw (0, errors_1.defaultError)("UserCantBuyFromHimself");
    const tradeTypeBuyer = client_1.OPERATIONTYPE.PURCHASE;
    const tradeTypeSeller = client_1.OPERATIONTYPE.SALE;
    await tradeAvaliation_1.default.postTradeAvaliation(tradeTypeBuyer, buyerEnrollment.id);
    await tradeAvaliation_1.default.postTradeAvaliation(tradeTypeSeller, sellerEnrollmentId);
    const trade = await trade_repository_1.default.postTradeByEnrollmentsIds(sellerEnrollmentId, buyerEnrollment.id, itemId);
    await item_repository_1.default.updateItemTradeStatusByIdAndBoolean(itemId, true);
    return trade;
}
exports.postTrade = postTrade;
async function getTradesByUserIdOrEnrollId(userId, tradeType, enrollmentId) {
    if (tradeType !== client_1.OPERATIONTYPE.PURCHASE && tradeType !== client_1.OPERATIONTYPE.SALE) {
        throw (0, errors_1.defaultError)("InvalidTradeType");
    }
    let enrollment;
    if (isNaN(enrollmentId))
        enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!isNaN(enrollmentId))
        enrollment = await enrollment_repository_1.default.findEnrollmentById(enrollmentId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserEnrollmentNotFound");
    let trades;
    if (tradeType === client_1.OPERATIONTYPE.PURCHASE) {
        trades = await trade_repository_1.default.findTradesByBuyerEnrollmentId(enrollment.id);
        return trades;
    }
    trades = await trade_repository_1.default.findTradesBySellerEnrollmentId(enrollment.id);
    return trades;
}
exports.getTradesByUserIdOrEnrollId = getTradesByUserIdOrEnrollId;
async function getTradeAvaliations(userId) {
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserEnrollmentNotFound");
    const tradeAvaliations = await tradeAvaliation_1.default.getTradeAvaliations(enrollment.id);
    return tradeAvaliations;
}
exports.getTradeAvaliations = getTradeAvaliations;
async function getTradeById(tradeId, userId) {
    if (isNaN(tradeId))
        throw (0, errors_1.defaultError)("InvalidTradeId");
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserEnrollmentNotFound");
    const trade = await trade_repository_1.default.getTradeByTradeId(tradeId);
    if (trade.buyerEnrollmentId !== enrollment.id && trade.sellerEnrollmentId !== enrollment.id) {
        throw (0, errors_1.defaultError)("NotATradeMenber");
    }
    return trade;
}
exports.getTradeById = getTradeById;
async function updateTradeStatus(userId, tradeId) {
    let updatedTrade;
    if (isNaN(tradeId))
        throw (0, errors_1.defaultError)("InvalidTradeId");
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserEnrollmentNotFound");
    const trade = await trade_repository_1.default.getTradeByTradeId(tradeId);
    if (trade.buyerEnrollmentId !== enrollment.id && trade.sellerEnrollmentId !== enrollment.id) {
        throw (0, errors_1.defaultError)("NotATradeMember");
    }
    if (trade.buyerEnrollmentId === enrollment.id) {
        updatedTrade = await trade_repository_1.default.updateTradeBuyerStatus(tradeId);
    }
    if (trade.sellerEnrollmentId === enrollment.id) {
        updatedTrade = await trade_repository_1.default.updateTradeSellerStatus(tradeId);
    }
    if (updatedTrade.buyerStatus === client_1.TRADESTATUS.COMPLETE && updatedTrade.sellerStatus === client_1.TRADESTATUS.COMPLETE) {
        updatedTrade = await trade_repository_1.default.updateTradeStatus(tradeId);
        const sellerEnroll = await enrollment_repository_1.default.findEnrollmentById(trade.sellerEnrollmentId);
        sellerEnroll.freezedBalance -= trade.Item.price;
        sellerEnroll.balance += trade.Item.price;
        await enrollment_repository_1.default.updateEnrollmentBalance(sellerEnroll.balance, sellerEnroll.id);
        await enrollment_repository_1.default.updateEnrollmentFreezedBalance(sellerEnroll.freezedBalance, sellerEnroll.id);
    }
    return updatedTrade;
}
exports.updateTradeStatus = updateTradeStatus;
const tradeService = {
    postTrade,
    getTradesByUserIdOrEnrollId,
    getTradeAvaliations,
    getTradeById,
    updateTradeStatus
};
exports.default = tradeService;
