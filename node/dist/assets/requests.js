"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../errors");
async function get(url) {
    try {
        const result = await axios_1.default.get(url);
        return result;
    }
    catch (error) {
        const detail = error.status + error.statusText;
        return (0, errors_1.defaultError)(detail);
    }
}
exports.request = { get };
