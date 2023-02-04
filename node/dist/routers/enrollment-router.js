"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentRouter = void 0;
const express_1 = require("express");
const schemas_1 = require("../schemas");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
const enrollmentRouter = (0, express_1.Router)();
exports.enrollmentRouter = enrollmentRouter;
enrollmentRouter.get("/", authentication_middleware_1.authenticateToken, controllers_1.getEnrollment);
enrollmentRouter.post("/", authentication_middleware_1.authenticateToken, (0, middlewares_1.validateBody)(schemas_1.upsertEnrollmentSchema), controllers_1.upsertEnrollment);
enrollmentRouter.put("/balance", authentication_middleware_1.authenticateToken, (0, middlewares_1.validateBody)(schemas_1.updateEnrollmentSchema), controllers_1.updateBalance);
