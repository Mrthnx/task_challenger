import { Container } from "inversify";
import { TYPES } from "./types";
import { WebConfiguration } from "./web";
import { RoutesConfiguration } from "./router";
import { DataSource } from "typeorm";
import { AuthController } from "../module/auth/auth.controller";
import { AuthService } from "../module/auth/auth.service";
import { HealthController } from "../module/health/health.controller";
import { HealthService } from "../module/health/health.service";
import { UserRepository } from "../module/users/user.repository";
import { TaskRepository } from "../module/tasks/task.repository";
import { TaskService } from "../module/tasks/task.service";
import { TaskController } from "../module/tasks/task.controller";

const container = new Container();

export const applyConfigurationContainer = () => {
  container
    .bind<WebConfiguration>(TYPES.WebConfiguration)
    .to(WebConfiguration)
    .inSingletonScope();

  container
    .bind<RoutesConfiguration>(TYPES.RoutesConfiguration)
    .to(RoutesConfiguration)
    .inSingletonScope();
};

export const applyContainer = (connection: DataSource) => {
  container.bind<DataSource>(TYPES.DataSource).toConstantValue(connection);

  // Controllers
  container
    .bind<AuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();

  container
    .bind<AuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();

  container
    .bind<HealthController>(TYPES.HealthController)
    .to(HealthController)
    .inSingletonScope();

  container
    .bind<HealthService>(TYPES.HealthService)
    .to(HealthService)
    .inSingletonScope();

  container
    .bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  container
    .bind<TaskController>(TYPES.TaskController)
    .to(TaskController)
    .inSingletonScope();

  container
    .bind<TaskService>(TYPES.TaskService)
    .to(TaskService)
    .inSingletonScope();

  container
    .bind<TaskRepository>(TYPES.TaskRepository)
    .to(TaskRepository)
    .inSingletonScope();
};

export default container;
