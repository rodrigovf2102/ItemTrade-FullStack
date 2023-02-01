"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.messagesSchema = joi_1.default.object({
    text: joi_1.default.string().required(),
    tradeId: joi_1.default.number().required()
});
