import { inject } from "inversify";
import { BaseService } from "../base/base.service";
import { Task } from "./task.entity";
import { TYPES } from "../../config/types";
import TaskRepository from "./task.repository";
import CreateTaskDto from "./dtos/create-task.dto";
import { HTTP_CODE_NOT_FOUND } from "../../config/constants";
import AppError from "../../utils/app.error";
import { UserRepository } from "../users/user.repository";
import UpdateTaskDto from "./dtos/update-task.dto";
import { UserRequest } from "../../utils/app.interfaces";

export default class TaskService extends BaseService<Task, unknown> {
  constructor(
    @inject(TYPES.TaskRepository)
    private readonly taskRepository: TaskRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super(taskRepository);
  }

  async getAllByUser(userId: number) {
    const tasks = await this.taskRepository.findAll(
      { user: { id: userId }, state: true },
      ["user"],
    );
    return tasks.sort((task) => (task.isCompleted ? 1 : -1));
  }

  async changeStatus(id: number) {
    const task = await this.taskRepository.findOne({ id, state: true });

    if (!task) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "Task does not exist");
    }

    const taskToUpdate = this.taskRepository.create({
      ...task,
      isCompleted: !task.isCompleted,
    });

    await this.taskRepository.save(taskToUpdate);
  }

  override async createValidation(viewModel: CreateTaskDto) {
    const { userId } = viewModel;
    const existsUser = await this.userRepository.exists({
      where: { id: userId, state: true },
    });
    if (!existsUser) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "User does not exist");
    }

    viewModel = new CreateTaskDto({
      ...viewModel,
    });

    return this.taskRepository.create({
      ...viewModel,
      user: { id: userId },
    } as unknown as Task);
  }

  override async updateValidation(viewModel: UpdateTaskDto) {
    const existsTask = await this.taskRepository.exists({
      where: {
        id: viewModel.id,
        state: true,
        user: {
          id: viewModel.userId,
        },
      },
      relations: ["user"],
    });

    if (!existsTask) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "Task does not exist");
    }

    viewModel = new UpdateTaskDto({
      ...viewModel,
      isCompleted: viewModel.isCompleted ?? false,
    });

    return this.taskRepository.create({
      ...viewModel,
    } as unknown as Task);
  }

  override async deleteValidation(id: number, options: unknown) {
    const { id: userId } = options as UserRequest;
    const existsTask = await this.taskRepository.exists({
      where: {
        id,
        state: true,
        user: {
          id: userId,
        },
      },
      relations: ["user"],
    });
    if (!existsTask) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "Task does not exist");
    }
  }
}
