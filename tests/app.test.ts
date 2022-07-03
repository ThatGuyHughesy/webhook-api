import supertest from "supertest";
import app from "../src/app";

const validWebhook = {
  url: "https://requestbin.fullcontact.com/rf385urf",
  token: "FOO",
};

const validPayload = {
  payload: ["any", { valid: "JSON" }],
};

const invalidWebhook = {
  url: "requestbin.fullcontact.com/rf385urf",
  token: "FOO",
};

const invalidPayload = {
  payload: 1,
};

describe("GET /api/webhooks", () => {
  it("should return a 404", async () => {
    const { statusCode } = await supertest(app).get("/api/random");
    expect(statusCode).toBe(404);
  });

  it("should return a 200 with an empty array", async () => {
    const { statusCode, body } = await supertest(app).get("/api/webhooks");
    expect(statusCode).toBe(200);
    expect(body).toEqual({
      success: true,
      data: [],
    });
  });
});

describe("POST /api/webhooks", () => {
  it("should return a 201 with the created webhook", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/webhooks")
      .send(validWebhook);
    expect(statusCode).toBe(201);
    expect(body).toEqual({
      success: true,
      data: validWebhook,
    });
  });

  it("should return a 422", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/webhooks")
      .send(invalidWebhook);
    expect(statusCode).toBe(422);
    expect(body).toEqual({
      error: "Validation failed",
    });
  });

  it("should return a 200 with an array containing the created webhook", async () => {
    const { statusCode, body } = await supertest(app).get("/api/webhooks");
    expect(statusCode).toBe(200);
    expect(body).toEqual({
      success: true,
      data: [validWebhook],
    });
  });
});

describe("POST /api/webhooks/test", () => {
  it("should return a 201 with the created payload", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/webhooks/test")
      .send(validPayload);
    expect(statusCode).toBe(201);
    expect(body).toEqual({
      success: true,
    });
  });

  it("should return a 422", async () => {
    const { statusCode, body } = await supertest(app)
      .post("/api/webhooks/test")
      .send(invalidPayload);
    expect(statusCode).toBe(422);
    expect(body).toEqual({
      error: "Validation failed",
    });
  });
});
