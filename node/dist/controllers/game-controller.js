"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGame = exports.getGames = void 0;
const games_service_1 = __importDefault(require("../services/games-service"));
const http_status_1 = __importDefault(require("http-status"));
async function getGames(req, res) {
    const filter = req.query.filter;
    try {
        const games = await games_service_1.default.getGames(filter);
        return res.status(http_status_1.default.OK).send(games);
    }
    catch (error) {
        if (error.detail === "GamesNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getGames = getGames;
async function postGame(req, res) {
    const { name, gameUrl } = req.body;
    const { userId } = req;
    try {
        const game = await games_service_1.default.postGame({ name, gameUrl }, userId);
        return res.status(http_status_1.default.CREATED).send(game);
    }
    catch (error) {
        if (error.detail === "GamesAlreadyExist") {
            return res.status(http_status_1.default.CONFLICT).send(error.detail);
        }
        if (error.detail === "UserWithoutEnrollment") {
            return res.status(http_status_1.default.CONFLICT).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.postGame = postGame;
