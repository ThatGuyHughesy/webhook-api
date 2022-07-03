import express from "express";
import { logger } from "../utils/logger";
import { validateRequest } from "../middlewares/validateRequest";
import { payloadSchema, webhookSchema } from "../schemas";
import { Webhook } from "../types/webhook";
import { eventEmitter, Events } from "../utils/eventEmitter";

const webhookRouter = express.Router();

const webhooks: Webhook[] = [];

webhookRouter
  .route("/")
  .get((_req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: webhooks,
      });
    } catch (err) {
      logger.error("Error retrieving webhooks:", err);
      res.status(500).json({
        error: "Error retrieving webhooks",
      });
    }
  })
  .post(validateRequest(webhookSchema), (req, res) => {
    try {
      const webhook = req.body;
      webhooks.push(webhook);
      res.status(201).json({
        success: true,
        data: webhook,
      });
    } catch (err) {
      logger.error("Error registering webhook:", err);
      res.status(500).json({
        error: "Error registering webhook",
      });
    }
  });

webhookRouter
  .route("/test")
  .post(validateRequest(payloadSchema), (req, res) => {
    try {
      const payload = req.body;
      webhooks.map((webhook) => {
        eventEmitter.emit(Events.WEBHOOK_SEND, {
          url: webhook.url,
          data: {
            ...payload,
            token: webhook.token,
          },
        });
      });
      res.status(201).json({
        success: true,
      });
    } catch (err) {
      logger.error("Error triggering webhooks:", err);
      res.status(500).json({
        error: "Error triggering webhooks",
      });
    }
  });

export { webhookRouter };
