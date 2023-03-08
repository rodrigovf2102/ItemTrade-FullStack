"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const api = axios_1.default.create({
    baseURL: "https://www.divine-pride.net/api/database/Item/",
});
async function getItemApi(itemId) {
    const response = await api.get(`${itemId}?apiKey=b8e4368691e139fdd1b4bc43bc0f5403`);
    return response.data.name;
}
async function generateItemsCards() {
    const items = [];
    const enrollIdsArr = await getEnrollsIds();
    const serverIds = await getServerIds();
    for (let i = 4001; i <= 4500; i++) {
        let itemApiName;
        try {
            itemApiName = await getItemApi(i);
        }
        catch (error) {
            itemApiName = undefined;
        }
        if (itemApiName) {
            const item = {
                name: itemApiName.toUpperCase(),
                price: Number(faker_1.faker.random.numeric(5)),
                amount: Number(faker_1.faker.random.numeric(1, { bannedDigits: ["0"] })),
                itemUrl: `https://static.divine-pride.net/images/items/cards/${i}.png`,
                serverId: randomNumber(serverIds),
                enrollmentId: randomNumber(enrollIdsArr),
                gameId: 2,
                itemType: client_1.ITEMTYPE.Raros,
            };
            items.push(item);
            console.log(item, i);
        }
    }
    const result = await prisma.item.createMany({
        data: items,
    });
    console.log(result);
}
async function generateItemsUtils() {
    const items = [];
    const enrollIdsArr = await getEnrollsIds();
    const serverIds = await getServerIds();
    for (let i = 501; i <= 599; i++) {
        let itemApiName;
        try {
            itemApiName = await getItemApi(i);
        }
        catch (error) {
            itemApiName = undefined;
        }
        if (itemApiName || itemApiName !== null || itemApiName !== "(null)") {
            const item = {
                name: itemApiName.toUpperCase(),
                price: Number(faker_1.faker.random.numeric(3)),
                amount: Number(faker_1.faker.random.numeric(3, { bannedDigits: ["0"] })),
                itemUrl: `https://www.divine-pride.net/img/items/collection/iRO/${i}`,
                serverId: randomNumber(serverIds),
                enrollmentId: randomNumber(enrollIdsArr),
                gameId: 2,
                itemType: client_1.ITEMTYPE.Utilizavel,
            };
            items.push(item);
            console.log(item, i);
        }
    }
    const result = await prisma.item.createMany({
        data: items,
    });
    console.log(result);
}
async function generateItemsEquips() {
    const items = [];
    const enrollIdsArr = await getEnrollsIds();
    const serverIds = await getServerIds();
    for (let i = 1201; i <= 2999; i++) {
        let itemApiName;
        try {
            itemApiName = await getItemApi(i);
        }
        catch (error) {
            itemApiName = undefined;
        }
        if (itemApiName && itemApiName !== null && itemApiName !== "(null)") {
            const item = {
                name: itemApiName.toUpperCase(),
                price: Number(faker_1.faker.random.numeric(4)),
                amount: Number(faker_1.faker.random.numeric(1, { bannedDigits: ["0", "9", "8", "7", "6", "5", "4", "3"] })),
                itemUrl: `https://www.divine-pride.net/img/items/collection/iRO/${i}`,
                serverId: randomNumber(serverIds),
                enrollmentId: randomNumber(enrollIdsArr),
                gameId: 2,
                itemType: client_1.ITEMTYPE.Equipamento,
            };
            items.push(item);
            console.log(item, i);
        }
    }
    const result = await prisma.item.createMany({
        data: items,
    });
    console.log(result);
}
async function generateItemsResources() {
    const items = [];
    const enrollIdsArr = await getEnrollsIds();
    const serverIds = await getServerIds();
    for (let i = 901; i <= 1099; i++) {
        let itemApiName;
        try {
            itemApiName = await getItemApi(i);
        }
        catch (error) {
            itemApiName = undefined;
        }
        if (itemApiName && itemApiName !== null && itemApiName !== "(null)") {
            const item = {
                name: itemApiName.toUpperCase(),
                price: Number(faker_1.faker.random.numeric(4)),
                amount: Number(faker_1.faker.random.numeric(3, { bannedDigits: ["0"] })),
                itemUrl: `https://www.divine-pride.net/img/items/collection/iRO/${i}`,
                serverId: randomNumber(serverIds),
                enrollmentId: randomNumber(enrollIdsArr),
                gameId: 2,
                itemType: client_1.ITEMTYPE.Recurso,
            };
            items.push(item);
            console.log(item, i);
        }
    }
    const result = await prisma.item.createMany({
        data: items,
    });
    console.log(result);
}
function randomNumber(numbers) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
}
async function generateItems() {
    await generateItemsCards();
    await generateItemsEquips();
    await generateItemsUtils();
    generateItemsResources().finally(async () => {
        await prisma.$disconnect();
    });
}
async function getEnrollsIds() {
    const enrolls = await prisma.enrollment.findMany({ select: { id: true } });
    const enrollIds = enrolls.map(enroll => enroll.id);
    return enrollIds;
}
async function getServerIds() {
    const game = await prisma.game.findFirst({ where: { name: "RAGNAROK" } });
    const servers = await prisma.server.findMany({
        select: { id: true },
        where: { gameId: game.id }
    });
    const serversIds = servers.map(server => server.id);
    return serversIds;
}
generateItems();
