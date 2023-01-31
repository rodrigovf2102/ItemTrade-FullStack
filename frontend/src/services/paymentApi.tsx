import { Payments, PaymentPost } from "../protocols";
import api from "./api";

export async function postPayment(newPayment: PaymentPost, token: string) : Promise<Payments> {
  const response = await api.post("/payments", newPayment, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

