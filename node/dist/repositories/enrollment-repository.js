"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEnrollmentByCPF = exports.updateEnrollmentFreezedBalance = exports.updateEnrollmentBalance = exports.findEnrollmentById = exports.findEnrollmentByUserId = exports.upsertEnrollment = void 0;
const config_1 = require("../config");
async function upsertEnrollment(newEnrollment, userId) {
    return config_1.prisma.enrollment.upsert({
        where: { userId },
        create: {
            enrollmentUrl: newEnrollment.enrollmentUrl,
            CPF: newEnrollment.CPF,
            name: newEnrollment.name,
            userId,
        },
        update: {
            enrollmentUrl: newEnrollment.enrollmentUrl,
            CPF: newEnrollment.CPF,
            name: newEnrollment.name,
            userId,
        },
    });
}
exports.upsertEnrollment = upsertEnrollment;
function findEnrollmentByUserId(userId) {
    return config_1.prisma.enrollment.findFirst({
        where: { userId },
    });
}
exports.findEnrollmentByUserId = findEnrollmentByUserId;
function findEnrollmentById(id) {
    return config_1.prisma.enrollment.findFirst({
        where: { id },
    });
}
exports.findEnrollmentById = findEnrollmentById;
function updateEnrollmentBalance(balance, id) {
    return config_1.prisma.enrollment.update({
        where: { id },
        data: { balance }
    });
}
exports.updateEnrollmentBalance = updateEnrollmentBalance;
function updateEnrollmentFreezedBalance(balance, id) {
    return config_1.prisma.enrollment.update({
        where: { id },
        data: { freezedBalance: balance }
    });
}
exports.updateEnrollmentFreezedBalance = updateEnrollmentFreezedBalance;
function findEnrollmentByCPF(cpf) {
    return config_1.prisma.enrollment.findFirst({
        where: { CPF: cpf }
    });
}
exports.findEnrollmentByCPF = findEnrollmentByCPF;
const enrollmentRepository = {
    upsertEnrollment,
    findEnrollmentByUserId,
    updateEnrollmentBalance,
    updateEnrollmentFreezedBalance,
    findEnrollmentById,
    findEnrollmentByCPF
};
exports.default = enrollmentRepository;
