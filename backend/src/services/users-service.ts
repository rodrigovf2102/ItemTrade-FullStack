import { defaultError } from "@/errors";
import { SessionWithNoId, UserWithEmailAndToken, UserWithEmailTokenAndId, UserWithNoId } from "@/protocols";
import userRepository from "@/repositories/user-repository";
import sessionRepository from "@/repositories/session-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser({ email, password }: UserWithNoId): Promise<User> {
  await verifyEmail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.createUser({ email, password: hashedPassword });
}

async function verifyEmail(email: string) {
  const userWithEmail = await userRepository.findUserByEmail(email);
  if (userWithEmail) {
    throw defaultError("DuplicatedEmail");
  }
}

export async function signIn({ email, password }: UserWithNoId): Promise<UserWithEmailTokenAndId> {
  const user = await getUser(email);
  await validatePassword(password, user.password);
  const token = await createSession(user.id);
  const session = { id: user.id ,email: user.email, token } as UserWithEmailTokenAndId;
  return session;
}

export async function signInWithToken({userId, token} : SessionWithNoId){
  const session = await sessionRepository.findSessionByUserIdAndToken({ userId, token});
  if(!session) throw defaultError ("SessionNotFound");
  return session;
}

async function getUser(email: string): Promise<User> {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw defaultError("EmailNotFound");
  return user;
}

async function validatePassword(password: string, userPassword: string) {
  const passwordValid = await bcrypt.compare(password, userPassword);
  if (!passwordValid) throw defaultError("PasswordInvalid");
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10h" });
  await sessionRepository.createSession({ token, userId });
  return token;
}

const userService = {
  createUser,
  signIn,
  signInWithToken
};

export default userService;
