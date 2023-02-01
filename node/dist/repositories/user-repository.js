"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByEmail = void 0;
const config_1 = require("../config");
async function findUserByEmail(email) {
    return config_1.prisma.user.findFirst({
        where: { email },
    });
}
exports.findUserByEmail = findUserByEmail;
async function createUser({ email, password }) {
    return config_1.prisma.user.create({
        data: { email, password },
    });
}
exports.createUser = createUser;
const userRepository = {
    findUserByEmail,
    createUser,
};
exports.default = userRepository;
