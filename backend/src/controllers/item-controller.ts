import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import { ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, ItemWithNoIdNoEnrollIdNoGameId } from "@/protocols";
import itemsService from "@/services/items-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getItems(req: Request, res: Response) {
  try {
    const itemType = req.params.type;
    const serverId = Number(req.params.serverId);
    const filter = req.query.filter as string;
    const itemId = Number(req.query.itemId);
    const items = await itemsService.getItems(serverId, itemType, filter, itemId);
    return res.status(httpStatus.OK).send(items);
  } catch (error) {
    if (error.detail === "ItemsNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    if (error.detail === "ServerNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    if (error.detail === "ItemTypeNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function postItem(req: AuthenticatedRequest, res: Response) {
  const newItem = req.body as ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName;
  const { userId } = req;
  try {
    const item = await itemsService.postItem(newItem, userId);
    return res.status(httpStatus.CREATED).send(item);
  } catch (error) {
    if (error.detail === "ItemAlreadyExist") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    if (error.detail === "UserWithoutEnrollment") {
      return res.status(httpStatus.CONFLICT).send(error.detail);
    }
    if (error.detail === "ServerNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    if (error.detail === "GameNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
