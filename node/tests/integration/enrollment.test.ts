import app, { start } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import jwt from "jsonwebtoken";
import { prisma } from "@/config";
import { createEnrollment } from "../factories/enrollment-factory";
import { generateCPF } from "@brazilian-utils/brazilian-utils";

beforeEach(async () => {
  await start();
  await cleanDb();
});

const server = supertest(app);

describe("GET /enrollment", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/enrollment");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/enrollment").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/enrollment").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when there is no enrollment", async () => {
      const token = await generateValidToken();

      const response = await server.get("/enrollment").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollment(user.id);

      const response = await server.get("/enrollment").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: enrollment.id,
          name: enrollment.name,
          CPF: enrollment.CPF,
          balance: enrollment.balance,
          enrollmentUrl: enrollment.enrollmentUrl,
          freezedBalance: enrollment.freezedBalance,
          userId: enrollment.userId,
        })
      );
    });
  });
});

describe("POST /enrollment", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/enrollment");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const generateValidBody = () => ({
        name: faker.name.findName(),
        CPF: generateCPF(),
        enrollmentUrl: faker.image.imageUrl(undefined, undefined, undefined, true),
      });

      it("should respond with status 201 and create new enrollment if there is not any", async () => {
        const body = generateValidBody();
        const token = await generateValidToken();

        const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK);
        const enrollment = await prisma.enrollment.findFirst({ where: { CPF: body.CPF } });
        expect(enrollment).toBeDefined();
      });

      it("should respond with status 201 and update enrollment", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollment(user.id);

        const response = await server.post("/enrollment").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: enrollment.id,
            CPF: expect.any(String),
            name: expect.any(String),
            enrollmentUrl: expect.any(String),
            userId: enrollment.userId,
            balance: enrollment.balance,
            freezedBalance: enrollment.freezedBalance,
          })
        );
      });
    });
  });
});
