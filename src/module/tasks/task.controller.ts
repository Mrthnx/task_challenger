import { inject, injectable } from "inversify";
import { TYPES } from "../../config/types";
import { BaseController } from "../base/base.controller";
import { Task } from "./task.entity";
import { TaskService } from "./task.service";
import { validationSchema } from "../../utils/app.middleware";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UpdateTaskDto } from "./dtos/update-task.dto";
import { handleRequest, parseSecureInt } from "../../utils/app.util";
import { Response } from "express";
import { AppRequest } from "../../utils/app.interfaces";

@injectable()
export class TaskController extends BaseController<Task, unknown> {
  constructor(
    @inject(TYPES.TaskService)
    private readonly taskService: TaskService,
  ) {
    super(taskService);
  }

  configureRoutes() {
    this.router.get("/", this.getAllByUser);
    this.router.get("/:id", this.getByKey);
    this.router.post("/", [validationSchema(CreateTaskDto)], this.create);
    this.router.put("/:id", [validationSchema(UpdateTaskDto)], this.update);
    this.router.put("/status/:id", this.changeStatus);
    this.router.delete("/:id", this.delete);
    return this.router;
  }

  private readonly getAllByUser = async (
    request: AppRequest,
    response: Response,
  ) => {
    handleRequest(async () => {
      const userId = request.user.id;
      const search = request.query.search as string;
      const tasks = await this.taskService.getAllByUser(userId, search);
      TaskController.returnOkResponse(response, tasks);
    }, response);
  };

  private readonly changeStatus = async (
    request: AppRequest,
    response: Response,
  ) => {
    handleRequest(async () => {
      await this.taskService.changeStatus(parseSecureInt(+request.params.id));
      TaskController.returnOkEmptyResponse(response);
    }, response);
  };
}
