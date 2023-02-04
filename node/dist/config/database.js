"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectPostgresDb = exports.prisma = void 0;
const client_1 = require("@prisma/client");
function connectPostgresDb() {
    exports.prisma = new client_1.PrismaClient();
}
exports.connectPostgresDb = connectPostgresDb;
async function disconnectDB() {
    await exports.prisma?.$disconnect();
}
exports.disconnectDB = disconnectDB;
