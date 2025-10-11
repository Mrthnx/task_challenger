import { Application, Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { loggerApp } from "./logger";
import { TYPES } from "./types";
import { AuthController } from "../module/auth/auth.controller";
import { HealthController } from "../module/health/health.controller";
import { TaskController } from "../module/tasks/task.controller";
import { validateToken } from "../utils/app.middleware";
import AppError from "../utils/app.error";

const logger = loggerApp("router");

@injectable()
export class RoutesConfiguration {
  constructor(
    @inject(TYPES.AuthController)
    private readonly authController: AuthController,
    @inject(TYPES.HealthController)
    private readonly healthController: HealthController,
    @inject(TYPES.TaskController)
    private readonly taskController: TaskController,
  ) {}

  configure(app: Application) {
    logger.info("Initializing routes");

    app.use("/health", this.healthController.configureRoutes());
    app.use("/v1", this.authController.configureRoutes());
    app.use(
      "/v1/tasks",
      [validateToken],
      this.taskController.configureRoutes(),
    );

    // Global error handler - must be after all routes
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error({ error: err }, "Unhandled error");
      if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  }
}
