"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServer = exports.findServerByNameAndGameId = exports.findServerByName = exports.findServerById = exports.findServersByGameId = void 0;
const config_1 = require("../config");
async function findServersByGameId(gameId, filter) {
    return config_1.prisma.server.findMany({
        where: { gameId, name: { contains: filter } },
        include: { Game: true },
        take: 30
    });
}
exports.findServersByGameId = findServersByGameId;
async function findServerById(serverId) {
    return config_1.prisma.server.findFirst({
        where: { id: serverId },
    });
}
exports.findServerById = findServerById;
async function findServerByName(name) {
    return config_1.prisma.server.findFirst({
        where: { name },
    });
}
exports.findServerByName = findServerByName;
async function findServerByNameAndGameId(name, gameId) {
    return config_1.prisma.server.findFirst({
        where: { name, gameId },
    });
}
exports.findServerByNameAndGameId = findServerByNameAndGameId;
async function postServer({ name, gameId }) {
    return config_1.prisma.server.create({
        data: { name, gameId },
    });
}
exports.postServer = postServer;
const serverRepository = {
    findServersByGameId,
    postServer,
    findServerByName,
    findServerById,
    findServerByNameAndGameId
};
exports.default = serverRepository;
