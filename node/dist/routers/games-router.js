"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesRouter = void 0;
const express_1 = require("express");
const schemas_1 = require("../schemas");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
const gamesRouter = (0, express_1.Router)();
exports.gamesRouter = gamesRouter;
gamesRouter.get("/", controllers_1.getGames);
gamesRouter.post("/", authentication_middleware_1.authenticateToken, (0, middlewares_1.validateBody)(schemas_1.createGameSchema), controllers_1.postGame);
