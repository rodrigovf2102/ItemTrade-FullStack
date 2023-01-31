import axios from "axios";
import { defaultError } from "@/errors";

async function get(url: string) {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    const detail = error.status + error.statusText as string;
    return defaultError(detail);
  }
}

export const request = { get };

