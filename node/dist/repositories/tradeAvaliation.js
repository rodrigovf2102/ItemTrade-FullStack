"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeAvaliations = exports.postTradeAvaliation = void 0;
const config_1 = require("../config");
async function postTradeAvaliation(tradeType, enrollmentId) {
    return config_1.prisma.tradeAvaliation.create({
        data: { tradeType, enrollmentId }
    });
}
exports.postTradeAvaliation = postTradeAvaliation;
async function getTradeAvaliations(enrollmentId) {
    return config_1.prisma.tradeAvaliation.findMany({
        where: { enrollmentId }
    });
}
exports.getTradeAvaliations = getTradeAvaliations;
const tradeAvaliationRepository = {
    postTradeAvaliation,
    getTradeAvaliations
};
exports.default = tradeAvaliationRepository;
