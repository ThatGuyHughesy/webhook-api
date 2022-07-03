import express from "express";
import { webhookRouter } from "./webhook";

const router = express.Router();

router.use("/api/webhooks", webhookRouter);

export default router;
