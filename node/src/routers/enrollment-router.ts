import { Router } from "express";
import { upsertEnrollmentSchema, updateEnrollmentSchema } from "@/schemas";
import { validateBody } from "@/middlewares";
import { getEnrollment, upsertEnrollment, updateBalance } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";

const enrollmentRouter = Router();

enrollmentRouter.get("/", authenticateToken , getEnrollment);
enrollmentRouter.post("/", authenticateToken, validateBody(upsertEnrollmentSchema), upsertEnrollment);
enrollmentRouter.put("/balance", authenticateToken, validateBody(updateEnrollmentSchema), updateBalance );

export { enrollmentRouter };
