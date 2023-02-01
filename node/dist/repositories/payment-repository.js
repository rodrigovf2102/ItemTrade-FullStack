"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentByHash = exports.postPayment = void 0;
const config_1 = require("../config");
async function postPayment(paymentPost) {
    return config_1.prisma.payments.create({
        data: paymentPost
    });
}
exports.postPayment = postPayment;
async function getPaymentByHash(paymentHash) {
    return config_1.prisma.payments.findFirst({
        where: { paymentHash }
    });
}
exports.getPaymentByHash = getPaymentByHash;
const paymentRepository = {
    postPayment,
    getPaymentByHash
};
exports.default = paymentRepository;
