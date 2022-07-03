import express from "express";
import { Server } from "http";
import { WebhookService } from "../../src/services/webhook";
import { eventEmitter, Events } from "../../src/utils/eventEmitter";

const webhookSuccess = {
  url: `http://localhost:3000/test`,
  data: { token: "FOO", payload: ["any", { valid: "JSON" }] },
};

const webhookUnauthorized = {
  url: `http://localhost:3000/test`,
  data: { token: "BAR", payload: ["any", { valid: "JSON" }] },
};

const webhookNotFound = {
  url: `http://localhost:3000/random`,
  data: { token: "FOO", payload: ["any", { valid: "JSON" }] },
};

let server: Server;
let serverSuccessWebhook: JSON | null;
let serverUnauthorizedWebhook: JSON | null;

describe("Webhook service", () => {
  beforeAll(async () => {
    new WebhookService(1, 1);

    const app = express();

    app.use(express.json());

    app.post("/test", (req, res) => {
      if (req.body?.token === "FOO") {
        serverSuccessWebhook = req.body;
        res.status(201).send();
      } else {
        serverUnauthorizedWebhook = req.body;
        res.status(401).send();
      }
    });

    await new Promise((resolve) => {
      server = app.listen(3000, () => {
        resolve(true);
      });
    });
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  });

  beforeEach(() => {
    serverSuccessWebhook = null;
    serverUnauthorizedWebhook = null;
  });

  it("should send the webhook successfully", (done) => {
    eventEmitter.emit(Events.WEBHOOK_SEND, webhookSuccess);

    setTimeout(() => {
      expect(serverSuccessWebhook).toEqual(webhookSuccess.data);
      done();
    }, 500);
  });

  it("should fail to send the webhook due to incorrect token", (done) => {
    eventEmitter.emit(Events.WEBHOOK_SEND, webhookUnauthorized);

    setTimeout(() => {
      expect(serverSuccessWebhook).toBeNull;
      expect(serverUnauthorizedWebhook).toEqual(webhookUnauthorized.data);
      done();
    }, 1500);
  });

  it("should fail to send the webhook due to incorrect URL", (done) => {
    eventEmitter.emit(Events.WEBHOOK_SEND, webhookNotFound);

    setTimeout(() => {
      expect(serverSuccessWebhook).toBeNull;
      expect(serverUnauthorizedWebhook).toBeNull;
      done();
    }, 1500);
  });
});
