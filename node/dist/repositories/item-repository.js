"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postItem = exports.updateItemTradeStatusByIdAndBoolean = exports.findItems = exports.findItemsByServerId = exports.findItemsById = exports.findItemsByItemTypeAndFilter = exports.findItemsByServerIdAndItemType = void 0;
const config_1 = require("../config");
async function findItemsByServerIdAndItemType(serverId, itemType, filter) {
    return config_1.prisma.item.findMany({
        where: {
            serverId,
            itemType,
            name: { contains: filter },
            inTrade: false,
        },
        include: { Game: true, Server: true, Enrollment: true },
        take: 30
    });
}
exports.findItemsByServerIdAndItemType = findItemsByServerIdAndItemType;
async function findItemsByItemTypeAndFilter(itemType, filter) {
    return config_1.prisma.item.findMany({
        where: {
            itemType,
            name: { contains: filter },
            inTrade: false,
        },
        include: { Game: true, Server: true, Enrollment: true },
        take: 30
    });
}
exports.findItemsByItemTypeAndFilter = findItemsByItemTypeAndFilter;
async function findItemsById(itemId) {
    return config_1.prisma.item.findMany({
        where: {
            id: itemId,
            inTrade: false,
        },
        include: { Game: true, Server: true, Enrollment: true },
    });
}
exports.findItemsById = findItemsById;
async function findItemsByServerId(serverId, filter) {
    return config_1.prisma.item.findMany({
        where: {
            serverId,
            name: { contains: filter },
            inTrade: false,
        },
        include: { Game: true, Server: true, Enrollment: true },
        take: 30
    });
}
exports.findItemsByServerId = findItemsByServerId;
async function findItems(filter) {
    return config_1.prisma.item.findMany({
        where: {
            name: { contains: filter },
            inTrade: false,
        },
        include: { Game: true, Server: true, Enrollment: true },
        take: 30
    });
}
exports.findItems = findItems;
async function updateItemTradeStatusByIdAndBoolean(id, bool) {
    return config_1.prisma.item.update({
        where: { id },
        data: { inTrade: bool },
    });
}
exports.updateItemTradeStatusByIdAndBoolean = updateItemTradeStatusByIdAndBoolean;
async function postItem(newItem) {
    return config_1.prisma.item.create({
        data: newItem,
    });
}
exports.postItem = postItem;
const itemRepository = {
    findItemsByServerIdAndItemType,
    postItem,
    findItems,
    findItemsByServerId,
    findItemsByItemTypeAndFilter,
    findItemsById,
    updateItemTradeStatusByIdAndBoolean
};
exports.default = itemRepository;
