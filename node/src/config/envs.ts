import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

export function loadEnv() {
  let path: string;

  if (process.env.NODE_ENV === "test") path = ".env.test";
  if (process.env.NODE_ENV === "development") path = ".env.development";
  if (!path) path = ".env";

  const currentEnv = dotenv.config({ path });
  dotenvExpand.expand(currentEnv);
}
