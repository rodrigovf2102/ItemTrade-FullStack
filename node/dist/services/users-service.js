"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInWithToken = exports.signIn = exports.createUser = void 0;
const errors_1 = require("../errors");
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const session_repository_1 = __importDefault(require("../repositories/session-repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function createUser({ email, password }) {
    await verifyEmail(email);
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    return user_repository_1.default.createUser({ email, password: hashedPassword });
}
exports.createUser = createUser;
async function verifyEmail(email) {
    const userWithEmail = await user_repository_1.default.findUserByEmail(email);
    if (userWithEmail) {
        throw (0, errors_1.defaultError)("DuplicatedEmail");
    }
}
async function signIn({ email, password }) {
    const user = await getUser(email);
    await validatePassword(password, user.password);
    const token = await createSession(user.id);
    const session = { id: user.id, email: user.email, token };
    return session;
}
exports.signIn = signIn;
async function signInWithToken({ userId, token }) {
    const session = await session_repository_1.default.findSessionByUserIdAndToken({ userId, token });
    if (!session)
        throw (0, errors_1.defaultError)("SessionNotFound");
    return session;
}
exports.signInWithToken = signInWithToken;
async function getUser(email) {
    const user = await user_repository_1.default.findUserByEmail(email);
    if (!user)
        throw (0, errors_1.defaultError)("EmailNotFound");
    return user;
}
async function validatePassword(password, userPassword) {
    const passwordValid = await bcrypt_1.default.compare(password, userPassword);
    if (!passwordValid)
        throw (0, errors_1.defaultError)("PasswordInvalid");
}
async function createSession(userId) {
    const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10h" });
    await session_repository_1.default.createSession({ token, userId });
    return token;
}
const userService = {
    createUser,
    signIn,
    signInWithToken
};
exports.default = userService;
