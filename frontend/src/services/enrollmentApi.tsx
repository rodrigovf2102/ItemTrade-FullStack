import { Amount, Enrollment, EnrollmentPost } from "../protocols";
import api from "./api";

export async function getEnrollment(token: string) : Promise<Enrollment> {
  const response = await api.get("/enrollment", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function postEnrollment(enrollment: EnrollmentPost, token: string) : Promise<Enrollment> {
  const response = await api.post("/enrollment", enrollment, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

export async function updateEnrollment(amount: Amount, token: string) : Promise<Enrollment> {
  const response = await api.put("/enrollment/balance", amount, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

