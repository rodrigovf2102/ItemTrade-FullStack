import { defaultError } from "@/errors";
import { ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, ItemWithNoId } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import gameRepository from "@/repositories/game-repository";
import itemRepository from "@/repositories/item-repository";
import serverRepository from "@/repositories/server-repository";
import { Item, ITEMTYPE } from "@prisma/client";

export async function getItems(serverId: number, itemType: string, filter: string, itemId: number): Promise<Item[]> {
  let items : Item[];
  if(!isNaN(itemId) && itemId!==0) {
    items = await itemRepository.findItemsById(itemId);
    return items;
  }
  if (isNaN(serverId) || serverId===undefined) throw defaultError("ServerNotFound");
  if(!itemType || itemType==="undefined" || itemType==="Todos") itemType = "";
  if(filter==="undefined") filter="";
  filter = filter.toUpperCase();
  const itemCategories = ["Dinheiro", "Equipamento", "Recurso", "Utilizavel","Raros", "Outros", "Todos"];
  let itemTypeExist : ITEMTYPE;
  for (const itemCategory of itemCategories) {
    if (itemType === itemCategory) itemTypeExist = itemType as ITEMTYPE;
  }

  if(!serverId && itemType==="") items = await itemRepository.findItems(filter);
  if(!serverId && itemTypeExist) items = await itemRepository.findItemsByItemTypeAndFilter(itemTypeExist,filter);
  if(serverId && itemTypeExist)items = await itemRepository.findItemsByServerIdAndItemType(serverId, itemTypeExist, filter);
  if(serverId && !itemTypeExist) items = await itemRepository.findItemsByServerId(serverId,filter);
  return items;
}

export async function postItem(newItem: ItemNoIdNoEnrollIdNoGameIdNoServerIdServerName, userId: number): Promise<Item> {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw defaultError("UserWithoutEnrollment");
  const game = await gameRepository.findGameByName(newItem.gameName.toUpperCase());
  if(!game) throw defaultError("GameNotFound");
  const server = await serverRepository.findServerByNameAndGameId(newItem.serverName.toUpperCase(),game.id);
  if(!server) throw defaultError("ServerNotFound");
  const item : ItemWithNoId = {
    enrollmentId: enrollment.id,
    name: newItem.name.toUpperCase(),
    price: newItem.price,
    amount : newItem.amount,
    itemUrl: newItem.itemUrl,
    serverId: server.id,
    gameId: server.gameId,
    itemType: newItem.itemType
  };
  const createdItem = await itemRepository.postItem(item);
  return createdItem;
}

const itemsService = {
  getItems,
  postItem,
};

export default itemsService;
