"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSessionByUserIdAndToken = exports.createSession = void 0;
const config_1 = require("../config");
async function createSession({ userId, token }) {
    return config_1.prisma.session.create({ data: { userId, token } });
}
exports.createSession = createSession;
async function findSessionByUserIdAndToken({ userId, token }) {
    return config_1.prisma.session.findFirst({ where: { userId, token } });
}
exports.findSessionByUserIdAndToken = findSessionByUserIdAndToken;
const sessionRepository = {
    createSession,
    findSessionByUserIdAndToken
};
exports.default = sessionRepository;
