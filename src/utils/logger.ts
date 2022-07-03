import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "warn";
    case "developerment":
      return "debug";
    case "test":
      return "error";
    default:
      return "debug";
  }
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    silent: process.env.NODE_ENV === "test",
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    silent: process.env.NODE_ENV === "test",
  }),
  new winston.transports.File({
    filename: "logs/server.log",
    silent: process.env.NODE_ENV === "test",
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export { logger };
