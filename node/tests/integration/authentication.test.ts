import app, { start } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await start();
  await cleanDb();
});

const server = supertest(app);

describe("POST /users/signin", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/users/signin");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/users/signin").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    it("should respond with status 400 if there is no user for given email", async () => {
      const body = generateValidBody();

      const response = await server.post("/users/signin").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/users/signin").send({
        email: body.email,
        password: faker.lorem.word(8)
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/users/signin").send(body);
        
        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with user data", async () => {
        const body = generateValidBody();
        const user = await createUser(body);

        const response = await server.post("/users/signin").send(body);

        expect(response.body).toEqual({
          id: user.id,
          email: user.email,
          token: expect.any(String)
        });
      });

      it("should respond with session token", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/users/signin").send(body);

        expect(response.body.token).toBeDefined();
      });
    });
  });
});
