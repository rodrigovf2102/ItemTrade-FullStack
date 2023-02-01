import { ApplicationError } from "@/protocols";

export function defaultError(detail: string): ApplicationDefaultError {
  return {
    name: "Error",
    message: "Unhable to proceed",
    detail,
  };
}

type ApplicationDefaultError = ApplicationError & { detail: string; };
