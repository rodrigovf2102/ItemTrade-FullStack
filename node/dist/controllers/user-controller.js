"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInToken = exports.signInPost = exports.usersPost = void 0;
const users_service_1 = __importDefault(require("../services/users-service"));
const http_status_1 = __importDefault(require("http-status"));
async function usersPost(req, res) {
    const { email, password } = req.body;
    try {
        const user = await users_service_1.default.createUser({ email, password });
        return res.status(http_status_1.default.CREATED).json({
            id: user.id,
            email: user.email,
        });
    }
    catch (error) {
        if (error.detail === "DuplicatedEmail") {
            return res.status(http_status_1.default.CONFLICT).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.usersPost = usersPost;
async function signInPost(req, res) {
    const { email, password } = req.body;
    try {
        const result = await users_service_1.default.signIn({ email, password });
        return res.status(http_status_1.default.OK).send(result);
    }
    catch (error) {
        if (error.detail === "PasswordInvalid") {
            return res.status(http_status_1.default.UNAUTHORIZED).send("InvalidCredentials");
        }
        if (error.detail === "EmailNotFound") {
            return res.status(http_status_1.default.UNAUTHORIZED).send("InvalidCredentials");
        }
        return res.sendStatus(http_status_1.default.BAD_REQUEST);
    }
}
exports.signInPost = signInPost;
async function signInToken(req, res) {
    const { userId, token } = req.body;
    try {
        const session = await users_service_1.default.signInWithToken({ userId, token });
        return res.status(http_status_1.default.OK).send(true);
    }
    catch (error) {
        return res.status(http_status_1.default.NOT_FOUND).send(false);
    }
}
exports.signInToken = signInToken;
