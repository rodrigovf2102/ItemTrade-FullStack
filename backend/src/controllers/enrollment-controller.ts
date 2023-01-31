import { AuthenticatedRequest } from "@/middlewares";
import { Amount, UpsertEnrollment } from "@/protocols";
import enrollmentService from "@/services/enrollment-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const enrollment = await enrollmentService.getEnrollment(userId);
    return res.status(httpStatus.OK).send(enrollment);
  } catch (error) {
    if (error.detail === "EnrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function upsertEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const newEnrollment = req.body as UpsertEnrollment; 
    const enrollment = await enrollmentService.upsertEnrollment(newEnrollment, userId);
    return res.status(httpStatus.OK).send(enrollment);
  } catch (error) {
    if (error.detail === "EnrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }
    if (error.detail === "InvalidCPF") {
      return res.status(httpStatus.BAD_REQUEST).send(error.detail);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function updateBalance(req: AuthenticatedRequest, res: Response){
  try {
    const { userId} = req;
    const balance = req.body as Amount;
    const enrollment = await enrollmentService.updateEnrollmentBalance(balance, userId);
    return res.status(httpStatus.OK).send(enrollment);
  } catch (error) {
    if (error.detail === "EnrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.detail);
    }  
    return res.status(httpStatus.BAD_REQUEST).send(error); 
  }
}
