"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnrollmentBalance = exports.upsertEnrollment = exports.getEnrollment = void 0;
const errors_1 = require("../errors");
const brazilian_utils_1 = require("@brazilian-utils/brazilian-utils");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const payment_repository_1 = __importDefault(require("../repositories/payment-repository"));
async function getEnrollment(userId) {
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("EnrollmentNotFound");
    return enrollment;
}
exports.getEnrollment = getEnrollment;
async function upsertEnrollment(newEnrollment, userId) {
    if (!(0, brazilian_utils_1.isValidCPF)(newEnrollment.CPF))
        throw (0, errors_1.defaultError)("InvalidCPF");
    let enrollment = await enrollment_repository_1.default.findEnrollmentByCPF(newEnrollment.CPF);
    if (enrollment)
        throw (0, errors_1.defaultError)("CPFAlreadyExists");
    if (!newEnrollment.enrollmentUrl)
        newEnrollment.enrollmentUrl = "../assets/images/action.jpg";
    enrollment = await enrollment_repository_1.default.upsertEnrollment(newEnrollment, userId);
    return enrollment;
}
exports.upsertEnrollment = upsertEnrollment;
async function updateEnrollmentBalance(amountInfo, userId) {
    if (isNaN(amountInfo.amount))
        throw (0, errors_1.defaultError)("InvalidamountInfo");
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("EnrollmentNotFound");
    const payment = await payment_repository_1.default.getPaymentByHash(amountInfo.paymentHash);
    if (!payment && amountInfo.amount > 0)
        throw (0, errors_1.defaultError)("PaymentNotFound");
    amountInfo.amount = enrollment.balance + amountInfo.amount;
    const enrollmentUpdated = await enrollment_repository_1.default.updateEnrollmentBalance(amountInfo.amount, enrollment.id);
    return enrollmentUpdated;
}
exports.updateEnrollmentBalance = updateEnrollmentBalance;
const enrollmentService = {
    getEnrollment,
    upsertEnrollment,
    updateEnrollmentBalance
};
exports.default = enrollmentService;
