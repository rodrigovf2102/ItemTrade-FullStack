import { prisma } from "@/config";
import { ItemWithNoId } from "@/protocols";
import { Item, ITEMTYPE } from "@prisma/client";
import { number } from "joi";

export async function findItemsByServerIdAndItemType(
  serverId: number,
  itemType: ITEMTYPE,
  filter: string
): Promise<Item[]> {
  return prisma.item.findMany({
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

export async function findItemsByItemTypeAndFilter(itemType: ITEMTYPE, filter: string): Promise<Item[]> {
  return prisma.item.findMany({
    where: {
      itemType,
      name: { contains: filter },
      inTrade: false,
    },
    include: { Game: true, Server: true, Enrollment: true },
    take: 30
  });
}

export async function findItemsById(itemId: number) {
  return prisma.item.findMany({
    where: {
      id: itemId,
      inTrade: false,
    },
    include: { Game: true, Server: true, Enrollment: true },
  });
}

export async function findItemsByServerId(serverId: number, filter: string): Promise<Item[]> {
  return prisma.item.findMany({
    where: {
      serverId,
      name: { contains: filter },
      inTrade: false,
    },
    include: { Game: true, Server: true, Enrollment: true },
    take: 30
  });
}

export async function findItems(filter: string): Promise<Item[]> {
  return prisma.item.findMany({
    where: {
      name: { contains: filter },
      inTrade: false,
    },
    include: { Game: true, Server: true, Enrollment: true },
    take: 30
  });
}

export async function updateItemTradeStatusByIdAndBoolean(id: number, bool: boolean ) {
  return prisma.item.update({
    where: { id },
    data: { inTrade: bool },
  });
}

export async function postItem(newItem: ItemWithNoId): Promise<Item> {
  return prisma.item.create({
    data: newItem,
  });
}

const itemRepository = {
  findItemsByServerIdAndItemType,
  postItem,
  findItems,
  findItemsByServerId,
  findItemsByItemTypeAndFilter,
  findItemsById,
  updateItemTradeStatusByIdAndBoolean
};

export default itemRepository;
