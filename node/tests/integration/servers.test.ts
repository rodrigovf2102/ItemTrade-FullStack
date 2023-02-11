import app, { start } from "@/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createGame, createServerWithGame, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import jwt from "jsonwebtoken";
import { prisma } from "@/config";
import { createEnrollment } from "../factories/enrollment-factory";

beforeEach(async () => {
  await start();
  await cleanDb();
});

const server = supertest(app);

describe("GET /servers", () => {
  it("should respond with status 200 and servers array", async () => {
    const game = await createGame();
    const gameServer = await createServerWithGame(game.id);
    const response = await server.get("/servers/0");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual(gameServer);
  });

  it("should respond with status 200 and games array when filter is used", async () => {
    const game = await createGame();
    const gameServer = await createServerWithGame(game.id);
    const response = await server.get(`/servers/0/?filter=${gameServer.name}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual(gameServer);
  });

  it("should respond with status 400 when there is no servers", async () => {
    const response = await server.get("/servers/0");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});


describe("POST /servers", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/servers");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/servers").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/servers").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/servers").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };
      faker.image.avatar;
      const response = await server.post("/servers").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", ()=>{
      it("should respond with satus 201 when server is created", async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollment(user.id);
        const game = await createGame();

        const body = {
          name: faker.name.firstName(),
          gameName: game.name,
        };
        
        const response = await server.post("/servers").set("Authorization", `Bearer ${token}`).send(body);
        const gameServer = await prisma.server.findFirst({ where: { gameId: game.id, name: body.name }});

        expect(response.status).toBe(httpStatus.CREATED);
        expect(gameServer).toBeDefined();
      });
    });

  });
});
