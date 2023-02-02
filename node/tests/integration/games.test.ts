import app, { start } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createGame, createUser } from "../factories";
import { cleanDb } from "../helpers";

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

  it("should respond with status 400 and games array", async () => {
    const response = await server.get("/games");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });


});