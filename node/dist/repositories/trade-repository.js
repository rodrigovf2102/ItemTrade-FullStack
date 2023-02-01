"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradeSellerStatus = exports.updateTradeBuyerStatus = exports.updateTradeStatus = exports.findTradesBySellerEnrollmentId = exports.findTradesByBuyerEnrollmentId = exports.getTradeByTradeId = exports.postTradeByEnrollmentsIds = void 0;
const config_1 = require("../config");
const client_1 = require("@prisma/client");
async function postTradeByEnrollmentsIds(sellerEnrollmentId, buyerEnrollmentId, itemId) {
    return config_1.prisma.trade.create({
        data: { sellerEnrollmentId, buyerEnrollmentId, itemId },
        include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true }
    });
}
exports.postTradeByEnrollmentsIds = postTradeByEnrollmentsIds;
async function getTradeByTradeId(tradeId) {
    return config_1.prisma.trade.findFirst({
        where: { id: tradeId },
        include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true }
    });
}
exports.getTradeByTradeId = getTradeByTradeId;
async function findTradesByBuyerEnrollmentId(enrollmentId) {
    return config_1.prisma.trade.findMany({
        where: { buyerEnrollmentId: enrollmentId },
        orderBy: { id: "desc" },
        include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true }
    });
}
exports.findTradesByBuyerEnrollmentId = findTradesByBuyerEnrollmentId;
async function findTradesBySellerEnrollmentId(enrollmentId) {
    return config_1.prisma.trade.findMany({
        where: { sellerEnrollmentId: enrollmentId },
        orderBy: { id: "desc" },
        include: { EnrollmentBuyer: true, EnrollmentSeller: true, Item: true }
    });
}
exports.findTradesBySellerEnrollmentId = findTradesBySellerEnrollmentId;
async function updateTradeStatus(tradeId) {
    return config_1.prisma.trade.update({
        where: { id: tradeId },
        data: { tradeStatus: client_1.TRADESTATUS.COMPLETE }
    });
}
exports.updateTradeStatus = updateTradeStatus;
async function updateTradeBuyerStatus(tradeId) {
    return config_1.prisma.trade.update({
        where: { id: tradeId },
        data: { buyerStatus: client_1.TRADESTATUS.COMPLETE }
    });
}
exports.updateTradeBuyerStatus = updateTradeBuyerStatus;
async function updateTradeSellerStatus(tradeId) {
    return config_1.prisma.trade.update({
        where: { id: tradeId },
        data: { sellerStatus: client_1.TRADESTATUS.COMPLETE }
    });
}
exports.updateTradeSellerStatus = updateTradeSellerStatus;
const tradeRepository = {
    postTradeByEnrollmentsIds,
    findTradesByBuyerEnrollmentId,
    findTradesBySellerEnrollmentId,
    getTradeByTradeId,
    updateTradeStatus,
    updateTradeBuyerStatus,
    updateTradeSellerStatus
};
exports.default = tradeRepository;
