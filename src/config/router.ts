import { Application } from "express";
import { inject, injectable } from "inversify";
import { loggerApp } from "./logger";
import { TYPES } from "./types";
import { AuthController } from "../module/auth/auth.controller";
import TaskController from "../module/tasks/task.controller";
import { validateToken } from "../utils/app.middleware";

const logger = loggerApp("router");

@injectable()
export class RoutesConfiguration {
  constructor(
    @inject(TYPES.AuthController)
    private readonly authController: AuthController,
    @inject(TYPES.TaskController)
    private readonly taskController: TaskController,
  ) {}

  configure(app: Application) {
    logger.info("Initializing routes");

    app.use(this.authController.configureRoutes());
    app.use("/tasks", [validateToken], this.taskController.configureRoutes());
  }
}
