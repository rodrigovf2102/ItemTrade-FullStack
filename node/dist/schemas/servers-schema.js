"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.serverSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    gameName: joi_1.default.string().required()
});
