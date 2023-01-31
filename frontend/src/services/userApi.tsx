import { UserWithEmailAndToken } from "../protocols";
import api from "./api";

export async function signIn( email : string, password : string) : Promise<UserWithEmailAndToken> {
  const response = await api.post("/users/signin", { email, password });
  return response.data;
};

export async function signUp( email : string, password : string) {
  const response = await api.post("/users/signup", { email, password });
  return response.data;
};

export async function signInToken( userId: number, token : string) : Promise<Boolean> {
  const response = await api.post("/users/signinToken", { userId, token });
  return response.data;
}
