import { ItemWithNoId } from "@/protocols";
import { faker } from "@faker-js/faker";
import { prisma } from "@/config";
import { Item, ITEMTYPE } from "@prisma/client";

const itemCategories = ["Dinheiro", "Equipamento", "Recurso", "Utilizavel", "Raros"];
const randomNumberZeroToFour = Number(faker.random.numeric(1,{ bannedDigits: ["9","8","7","6","5"]}));
const randomItemType = itemCategories[randomNumberZeroToFour] as ITEMTYPE;

export async function createItem(serverId : number, enrollmentId : number, gameId : number) : Promise<Item>{
  const item : ItemWithNoId = {
    name : faker.name.firstName().toUpperCase(),
    price : Number(faker.random.numeric()),
    amount : Number(faker.random.numeric()),
    serverId,
    enrollmentId,
    gameId,
    itemUrl : faker.image.imageUrl(undefined,undefined,undefined,true),
    itemType : randomItemType
  };

  return prisma.item.create({
    data: item
  });
}
