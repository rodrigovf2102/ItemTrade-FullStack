"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServer = exports.getServers = void 0;
const errors_1 = require("../errors");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const game_repository_1 = __importDefault(require("../repositories/game-repository"));
const server_repository_1 = __importDefault(require("../repositories/server-repository"));
async function getServers(gameId, filter) {
    if (filter === "undefined")
        filter = "";
    if (!filter)
        filter = "";
    filter = filter.toUpperCase();
    if (isNaN(gameId))
        throw (0, errors_1.defaultError)("Invalid gameId");
    if (gameId === 0)
        gameId = undefined;
    const servers = await server_repository_1.default.findServersByGameId(gameId, filter);
    if (servers.length === 0)
        throw (0, errors_1.defaultError)("ServersNotFound");
    return servers;
}
exports.getServers = getServers;
async function postServer({ name, gameName }, userId) {
    gameName = gameName.toUpperCase();
    name = name.toUpperCase();
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserWithoutEnrollment");
    const server = await server_repository_1.default.findServerByName(name);
    if (server)
        throw (0, errors_1.defaultError)("ServerAlreadyExist");
    const game = await game_repository_1.default.findGameByName(gameName);
    if (!game)
        throw (0, errors_1.defaultError)("GameNameDoesntExist");
    const createdServer = await server_repository_1.default.postServer({ name, gameId: game.id });
    return createdServer;
}
exports.postServer = postServer;
const serversService = {
    getServers,
    postServer
};
exports.default = serversService;
