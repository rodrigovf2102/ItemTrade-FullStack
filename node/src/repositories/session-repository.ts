import { prisma } from "@/config";
import { SessionWithNoId } from "@/protocols";

export async function createSession({ userId, token }: SessionWithNoId) {
  return prisma.session.create({ data: { userId, token } });
}

export async function findSessionByUserIdAndToken({userId, token} : SessionWithNoId){
  return prisma.session.findFirst({ where: {userId, token}});
}

const sessionRepository = {
  createSession,
  findSessionByUserIdAndToken
};

export default sessionRepository;
