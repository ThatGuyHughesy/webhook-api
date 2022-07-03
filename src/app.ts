import express from "express";
import routes from "./routes";
import { requestLogger } from "./middlewares/logRequest";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.use(routes);

export default app;
