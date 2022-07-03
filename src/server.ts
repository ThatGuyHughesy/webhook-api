import * as dotenv from "dotenv";
import app from "./app";
import { WebhookService } from "./services/webhook";
import { logger } from "./utils/logger";

dotenv.config();

const createServer = async () => {
  logger.debug("Starting server...");

  const PORT = process.env.PORT || 9876;
  const WEBHOOK_RETRY_INTERVAL_SECONDS =
    Number.parseInt(process.env.WEBHOOK_RETRY_INTERVAL_SECONDS) || 10;
  const WEBHOOK_MAX_RETRIES =
    Number.parseInt(process.env.WEBHOOK_MAX_RETRIES) || 5;

  new WebhookService(WEBHOOK_RETRY_INTERVAL_SECONDS, WEBHOOK_MAX_RETRIES);

  app.listen(PORT, () => {
    logger.debug(`Successfully started server on localhost:${PORT}`);
  });
};

createServer().catch((err) => {
  logger.error("Error starting server:", err);
});
