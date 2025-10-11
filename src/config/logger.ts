import pino from "pino";

const NODE_ENV = process.env.NODE_ENV || "dev";

const logger = pino(
  NODE_ENV === "production"
    ? { level: "info" }
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
);

export const loggerApp = (file: string) => logger.child({ file });
