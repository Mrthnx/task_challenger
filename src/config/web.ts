import * as express from "express";
import type { Application } from "express";
import { injectable } from "inversify";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { ENV } from "./environment";
import { join } from "path";
import { loggerApp } from "./logger";
import { requestLogger } from "../utils/app.middleware";

const logger = loggerApp("web");

@injectable()
export class WebConfiguration {
  configure(app: Application) {
    this.configureBodyParser(app);
    this.configureCors(app);
    this.configureRequestLogger(app);
    this.configureSwagger(app);
  }

  private configureBodyParser(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private configureCors(app: Application) {
    app.set("trust proxy", 1);
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: "*",
        credentials: true,
      }),
    );
  }

  private configureRequestLogger(app: Application) {
    app.use(requestLogger);
  }

  private configureSwagger(app: Application) {
    try {
      const swaggerPath = join(__dirname, "../../task_challenge.yml");
      const swaggerDocument = YAML.load(swaggerPath);
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      logger.info("Swagger UI configured at /api-docs");
    } catch (error) {
      logger.warn({ error }, "Failed to load Swagger documentation");
    }
  }
}
