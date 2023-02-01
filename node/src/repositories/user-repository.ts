import { prisma } from "@/config";
import { UserWithNoId } from "@/protocols";

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email },
  });
}

export async function createUser({ email, password }: UserWithNoId) {
  return prisma.user.create({
    data: { email, password },
  });
}

const userRepository = {
  findUserByEmail,
  createUser,
};

export default userRepository;
