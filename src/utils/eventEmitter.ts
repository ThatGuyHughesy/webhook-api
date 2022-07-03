import { EventEmitter } from "events";

const Events = {
  WEBHOOK_SEND: "webhook-send",
  WEBHOOK_ERROR: "webhook-error",
};
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
