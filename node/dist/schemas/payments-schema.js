"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.PaymentSchema = joi_1.default.object({
    creditCardLastDigits: joi_1.default.string().min(4).max(4).required(),
    cardIssuer: joi_1.default.string().max(40).required(),
    cardName: joi_1.default.string().max(100).required(),
    value: joi_1.default.number().min(100).required()
});
