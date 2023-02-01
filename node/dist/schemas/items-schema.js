"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.itemSchema = joi_1.default.object({
    name: joi_1.default.string().min(4).max(70).required(),
    price: joi_1.default.number().required(),
    amount: joi_1.default.number().required(),
    itemUrl: joi_1.default.alternatives().try(joi_1.default.string().pattern(new RegExp("^https://")).required())
        .try(joi_1.default.string().pattern(new RegExp("^data:image")).required()),
    gameName: joi_1.default.string().required(),
    serverName: joi_1.default.string().required(),
    itemType: joi_1.default.any().allow("Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Outros", "Raros"),
});
