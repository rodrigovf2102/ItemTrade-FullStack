"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPayment = void 0;
const errors_1 = require("../errors");
const payment_repository_1 = __importDefault(require("../repositories/payment-repository"));
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const uuid_1 = require("uuid");
const enrollment_service_1 = __importDefault(require("./enrollment-service"));
async function postPayment(payment, userId) {
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("EnrollmentNotFound");
    const paymentHash = (0, uuid_1.v4)();
    const paymentPost = { ...payment, enrollmentId: enrollment.id, paymentHash: paymentHash };
    const postedPayment = await payment_repository_1.default.postPayment(paymentPost);
    await enrollment_service_1.default.updateEnrollmentBalance({ amount: payment.value, paymentHash: paymentHash }, userId);
    return postedPayment;
}
exports.postPayment = postPayment;
const paymentService = {
    postPayment
};
exports.default = paymentService;
