import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";

import { createUser, createSession } from "./factories";
import { prisma } from "@/config";

export async function cleanDb() {
  await prisma.tradeMessage.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.payments.deleteMany({});
  await prisma.tradeAvaliation.deleteMany({});
  await prisma.trade.deleteMany({});
  await prisma.session.deleteMany({}); 
  await prisma.item.deleteMany({});
  await prisma.server.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.user.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
