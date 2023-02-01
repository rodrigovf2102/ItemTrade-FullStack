"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnrollmentSchema = exports.upsertEnrollmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.upsertEnrollmentSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    CPF: joi_1.default.string().min(11).max(11).required(),
    enrollmentUrl: joi_1.default.alternatives().try(joi_1.default.string().pattern(new RegExp("^https://")).required())
        .try(joi_1.default.string().pattern(new RegExp("^data:image")).required()),
});
exports.updateEnrollmentSchema = joi_1.default.object({
    amount: joi_1.default.number().required(),
    paymentHash: joi_1.default.string().required()
});
