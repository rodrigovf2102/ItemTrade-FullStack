"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postItem = exports.getItems = void 0;
const errors_1 = require("../errors");
const enrollment_repository_1 = __importDefault(require("../repositories/enrollment-repository"));
const game_repository_1 = __importDefault(require("../repositories/game-repository"));
const item_repository_1 = __importDefault(require("../repositories/item-repository"));
const server_repository_1 = __importDefault(require("../repositories/server-repository"));
async function getItems(serverId, itemType, filter, itemId) {
    let items;
    if (!isNaN(itemId) && itemId !== 0 && itemId) {
        items = await item_repository_1.default.findItemsById(itemId);
        return items;
    }
    if (isNaN(serverId) || serverId === undefined)
        throw (0, errors_1.defaultError)("ServerNotFound");
    if (serverId === 0)
        serverId = undefined;
    if (!itemType || itemType === "undefined" || itemType === "Todos")
        itemType = "";
    if (filter === "undefined")
        filter = "";
    if (!filter)
        filter = "";
    filter = filter.toUpperCase();
    const itemCategories = ["Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros", "Outros", "Todos"];
    let itemTypeExist;
    for (const itemCategory of itemCategories) {
        if (itemType === itemCategory)
            itemTypeExist = itemType;
    }
    if (!serverId && itemType === "")
        items = await item_repository_1.default.findItems(filter);
    if (!serverId && itemTypeExist)
        items = await item_repository_1.default.findItemsByItemTypeAndFilter(itemTypeExist, filter);
    if (serverId && itemTypeExist)
        items = await item_repository_1.default.findItemsByServerIdAndItemType(serverId, itemTypeExist, filter);
    if (serverId && !itemTypeExist)
        items = await item_repository_1.default.findItemsByServerId(serverId, filter);
    return items;
}
exports.getItems = getItems;
async function postItem(newItem, userId) {
    newItem.name = newItem.name.trim();
    const enrollment = await enrollment_repository_1.default.findEnrollmentByUserId(userId);
    if (!enrollment)
        throw (0, errors_1.defaultError)("UserWithoutEnrollment");
    const game = await game_repository_1.default.findGameByName(newItem.gameName.toUpperCase());
    if (!game)
        throw (0, errors_1.defaultError)("GameNotFound");
    const server = await server_repository_1.default.findServerByNameAndGameId(newItem.serverName.toUpperCase(), game.id);
    if (!server)
        throw (0, errors_1.defaultError)("ServerNotFound");
    const item = {
        enrollmentId: enrollment.id,
        name: newItem.name.toUpperCase(),
        price: newItem.price,
        amount: newItem.amount,
        itemUrl: newItem.itemUrl,
        serverId: server.id,
        gameId: server.gameId,
        itemType: newItem.itemType
    };
    const createdItem = await item_repository_1.default.postItem(item);
    return createdItem;
}
exports.postItem = postItem;
const itemsService = {
    getItems,
    postItem,
};
exports.default = itemsService;
