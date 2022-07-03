import axios from "axios";
import { eventEmitter, Events } from "../utils/eventEmitter";
import { logger } from "../utils/logger";

class WebhookService {
  retryTimeoutSeconds: number;
  maxRetries: number;

  constructor(retryTimeoutSeconds: number, maxRetries: number) {
    logger.debug("Starting webhook service...");
    this.retryTimeoutSeconds = retryTimeoutSeconds;
    this.maxRetries = maxRetries;
    this.initializeEventListeners();
    logger.debug("Successfully started webhook service");
  }

  initializeEventListeners(): void {
    eventEmitter.on(Events.WEBHOOK_SEND, async ({ url, data, retries = 0 }) => {
      await this.sendWebhook(url, data, retries);
    });

    eventEmitter.on(
      Events.WEBHOOK_ERROR,
      async ({ error, url, data, retries }) => {
        this.handleError(error, url, data, retries);
      }
    );
  }

  async sendWebhook(url: string, data: JSON, retries: number) {
    if (retries >= this.maxRetries) {
      logger.error(`Max retries sending webhook to ${url}`);
    } else {
      try {
        logger.debug(`Sending webhook to ${url}`);
        await axios(url, {
          method: "post",
          data: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        logger.debug(`Success sending webhook to ${url}`);
      } catch (err) {
        eventEmitter.emit(Events.WEBHOOK_ERROR, {
          err,
          url,
          data,
          retries,
        });
      }
    }
  }

  handleError(error: Error, url: string, data: JSON, retries: number) {
    const timeoutSeconds = Math.pow(2, retries) * this.retryTimeoutSeconds;
    logger.warn(`Error sending webhook to ${url}:`, error);
    logger.warn(`Retrying in ${timeoutSeconds} seconds...`);
    setTimeout(() => {
      eventEmitter.emit(Events.WEBHOOK_SEND, {
        url,
        data,
        retries: retries + 1,
      });
    }, timeoutSeconds * 1000);
  }
}

export { WebhookService };
