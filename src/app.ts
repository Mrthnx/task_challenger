import "reflect-metadata";
import express, { type Application } from "express";
import { ENV } from "./config/environment";
import { loggerApp } from "./config/logger";
import { TYPES } from "./config/types";
import type { WebConfiguration } from "./config/web";
import container, {
  applyConfigurationContainer,
  applyContainer,
} from "./config/inversify";
import type { RoutesConfiguration } from "./config/router";
import { dataSource } from "./config/database";

const logger = loggerApp("app");

applyConfigurationContainer();

const initializedDataBase = async () => {
  logger.info("Database connection established");
  await dataSource.initialize();
  applyContainer(dataSource);
  continueConfiguration();
};

initializedDataBase();

const continueStart = (app: Application) => {
  app.listen(ENV.APP.PORT, () =>
    logger.info(`Initialized on port ${ENV.APP.PORT} in ${ENV.NODE_ENV} mode`),
  );
};

const continueConfiguration = () => {
  const app: express.Application = express();

  const webConfiguration: WebConfiguration = container.get<WebConfiguration>(
    TYPES.WebConfiguration,
  );

  const routesConfiguration: RoutesConfiguration =
    container.get<RoutesConfiguration>(TYPES.RoutesConfiguration);

  webConfiguration.configure(app);
  routesConfiguration.configure(app);

  continueStart(app);
};
