"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPayment = void 0;
const payments_service_1 = __importDefault(require("../services/payments-service"));
const http_status_1 = __importDefault(require("http-status"));
async function postPayment(req, res) {
    try {
        const { userId } = req;
        const paymentPost = req.body;
        const postedPayment = await payments_service_1.default.postPayment(paymentPost, userId);
        return res.status(http_status_1.default.OK).send(postedPayment);
    }
    catch (error) {
        if (error.detail === "EnrollmentNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.postPayment = postPayment;
