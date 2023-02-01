"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postItem = exports.getItems = void 0;
const items_service_1 = __importDefault(require("../services/items-service"));
const http_status_1 = __importDefault(require("http-status"));
async function getItems(req, res) {
    try {
        const itemType = req.params.type;
        const serverId = Number(req.params.serverId);
        const filter = req.query.filter;
        const itemId = Number(req.query.itemId);
        const items = await items_service_1.default.getItems(serverId, itemType, filter, itemId);
        return res.status(http_status_1.default.OK).send(items);
    }
    catch (error) {
        if (error.detail === "ItemsNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        if (error.detail === "ServerNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        if (error.detail === "ItemTypeNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.getItems = getItems;
async function postItem(req, res) {
    const newItem = req.body;
    const { userId } = req;
    try {
        const item = await items_service_1.default.postItem(newItem, userId);
        return res.status(http_status_1.default.CREATED).send(item);
    }
    catch (error) {
        if (error.detail === "ItemAlreadyExist") {
            return res.status(http_status_1.default.CONFLICT).send(error.detail);
        }
        if (error.detail === "UserWithoutEnrollment") {
            return res.status(http_status_1.default.CONFLICT).send(error.detail);
        }
        if (error.detail === "ServerNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        if (error.detail === "GameNotFound") {
            return res.status(http_status_1.default.NOT_FOUND).send(error.detail);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.postItem = postItem;
