"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBalance = exports.upsertEnrollment = exports.getEnrollment = void 0;
const enrollment_service_1 = __importDefault(require("../services/enrollment-service"));
const http_status_1 = __importDefault(require("http-status"));
async function getEnrollment(req, res) {
    try {
        const { userId } = req;
        const enrollment = await enrollment_service_1.default.getEnrollment(userId);
        return res.status(http_status_1.default.OK).send(enrollment);
    }
    catch (error) {
        if (error.detail === "EnrollmentNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getEnrollment = getEnrollment;
async function upsertEnrollment(req, res) {
    try {
        const { userId } = req;
        const newEnrollment = req.body;
        const enrollment = await enrollment_service_1.default.upsertEnrollment(newEnrollment, userId);
        return res.status(http_status_1.default.OK).send(enrollment);
    }
    catch (error) {
        if (error.detail === "EnrollmentNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        if (error.detail === "InvalidCPF") {
            return res.status(http_status_1.default.BAD_REQUEST).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.upsertEnrollment = upsertEnrollment;
async function updateBalance(req, res) {
    try {
        const { userId } = req;
        const balance = req.body;
        const enrollment = await enrollment_service_1.default.updateEnrollmentBalance(balance, userId);
        return res.status(http_status_1.default.OK).send(enrollment);
    }
    catch (error) {
        if (error.detail === "EnrollmentNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.updateBalance = updateBalance;
