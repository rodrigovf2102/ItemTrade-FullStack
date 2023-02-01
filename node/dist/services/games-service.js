"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGame = exports.getGames = void 0;
const errors_1 = require("../errors");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const game_repository_1 = __importDefault(require("../repositories/game-repository"));
async function getGames(filter) {
    if (filter === "undefined")
        filter = "";
    if (!filter)
        filter = "";
    filter = filter.toUpperCase();
    const games = await game_repository_1.default.findGames(filter);
    return games;
}
exports.getGames = getGames;
async function postGame({ name, gameUrl }, userId) {
    name = name.toUpperCase();
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserWithoutEnrollment");
    const game = await game_repository_1.default.findGameByName(name);
    if (game)
        throw (0, errors_1.defaultError)("GameAlreadyExist");
    name = name.toUpperCase();
    const createdGame = await game_repository_1.default.postGame({ name, gameUrl });
    return createdGame;
}
exports.postGame = postGame;
const gamesService = {
    getGames,
    postGame
};
exports.default = gamesService;
