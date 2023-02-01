"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const routers_1 = require("./routers");
(0, config_1.loadEnv)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", routers_1.usersRouter);
app.use("/enrollment", routers_1.enrollmentRouter);
app.use("/games", routers_1.gamesRouter);
app.use("/servers", routers_1.serversRouter);
app.use("/items", routers_1.itemsRouter);
app.use("/payments", routers_1.paymentRouter);
app.use("/trades", routers_1.tradesRouter);
app.use("/messages", routers_1.messagesRouter);
function start() {
    (0, config_1.connectPostgresDb)();
    return Promise.resolve(app);
}
exports.start = start;
exports.default = app;
