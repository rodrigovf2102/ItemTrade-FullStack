import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;
export function connectPostgresDb(): void {
  prisma = new PrismaClient();
}
