import fs from "fs";
import morgan from "morgan";

const accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });

const requestLogger = morgan("common", {
  skip: () => process.env.NODE_ENV === "test",
  stream: accessLogStream,
});

export { requestLogger };
