"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.tradeSchema = joi_1.default.object({
    sellerEnrollmentId: joi_1.default.number().required(),
    itemId: joi_1.default.number().required()
});
