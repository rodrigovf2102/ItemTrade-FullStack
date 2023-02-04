import app, { start } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createGame, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import jwt from "jsonwebtoken";
import { prisma } from "@/config";
import { createEnrollment } from "../factories/enrollment-factory";

beforeEach(async () => {
  await start();
  await cleanDb();
});

const server = supertest(app);

describe("GET /games", () => {
  it("should respond with status 200 and games array", async () => {
    const game = await createGame();
    const response = await server.get("/games");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual(game);
  });

  it("should respond with status 200 and games array when filter is used", async () => {
    const game = await createGame();
    const response = await server.get(`/games/?filter=${game.name}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual(game);
  });

  it("should respond with status 400 when there is no games", async () => {
    const response = await server.get("/games");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe("POST /games", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/games");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/games").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/games").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/games").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/games").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      function generateValidBody() {
        const bodyType = Number(faker.random.numeric());
        const body = {
          name: faker.lorem.word(),
          gameUrl: "undefined",
        };
        if (bodyType <= 4) body.gameUrl = faker.image.dataUri();
        if (bodyType > 4) body.gameUrl = faker.image.imageUrl(undefined, undefined, undefined, true, true);
        return body;
      }

      it("should respond with status 201 and create new game if there is not any", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollment(user.id);

        const response = await server.post("/games").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const game = await prisma.game.findFirst({ where: { name: body.name } });
        expect(game).toBeDefined();
      });
    });

    describe("when body is invalid", () => {
      function generateValidBody() {
        const body = {
          name: faker.lorem.word(),
          gameUrl: faker.lorem.word(),
        };
        return body;
      }

      it("should respond with status 400 when body is invalid", async () => {
        const body = generateValidBody();
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollment(user.id);

        const response = await server.post("/games").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    });
  });
});
