import { Task } from "../../../src/module/tasks/task.entity";
import TaskService from "../../../src/module/tasks/task.service";
import AppError from "../../../src/utils/app.error";

const mockTaskRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  exists: jest.fn(),
};

const mockUserRepository = {
  exists: jest.fn(),
};

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    jest.clearAllMocks();
    taskService = new TaskService(
      mockTaskRepository as any,
      mockUserRepository as any,
    );
  });

  describe("getAllByUser", () => {
    it("should return tasks sorted with incomplete ones first", async () => {
      const userId = 1;
      const tasks: Task[] = [
        { id: 1, isCompleted: true } as Task,
        { id: 2, isCompleted: false } as Task,
      ];
      mockTaskRepository.findAll.mockResolvedValue(tasks);

      const result = await taskService.getAllByUser(userId);

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        { user: { id: userId }, state: true },
        ["user"],
      );
      expect(result[0].isCompleted).toBe(false);
      expect(result[1].isCompleted).toBe(true);
    });
  });

  describe("changeStatus", () => {
    it("should toggle task isCompleted status and save it", async () => {
      const task = { id: 1, isCompleted: false, state: true } as Task;
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.create.mockReturnValue({ ...task, isCompleted: true });

      await taskService.changeStatus(task.id);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        id: task.id,
        state: true,
      });
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...task,
        isCompleted: true,
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });

    it("should throw error if task not found", async () => {
      mockTaskRepository.findOne.mockResolvedValue(undefined);

      await expect(taskService.changeStatus(999)).rejects.toThrow(AppError);
      await expect(taskService.changeStatus(999)).rejects.toThrow(
        "Task does not exist",
      );
    });
  });

  describe("createValidation", () => {
    it("should return created task if user exists", async () => {
      const dto = { title: "New Task", userId: 1 } as any;
      const expectedTask = { title: "New Task", user: { id: 1 } };
      mockUserRepository.exists.mockResolvedValue(true);
      mockTaskRepository.create.mockReturnValue(expectedTask);

      const result = await taskService.createValidation(dto);

      expect(mockUserRepository.exists).toHaveBeenCalledWith({
        where: { id: dto.userId, state: true },
      });
      expect(result).toEqual(expectedTask);
    });

    it("should throw error if user does not exist", async () => {
      mockUserRepository.exists.mockResolvedValue(false);

      await expect(
        taskService.createValidation({ userId: 99 } as any),
      ).rejects.toThrow("User does not exist");
    });
  });

  describe("updateValidation", () => {
    it("should return updated task if exists", async () => {
      const dto = { id: 1, userId: 2, title: "Updated" } as any;
      mockTaskRepository.exists.mockResolvedValue(true);
      mockTaskRepository.create.mockReturnValue(dto);

      const result = await taskService.updateValidation(dto);

      expect(mockTaskRepository.exists).toHaveBeenCalledWith({
        where: {
          id: dto.id,
          state: true,
          user: { id: dto.userId },
        },
        relations: ["user"],
      });
      expect(result).toEqual(dto);
    });

    it("should throw error if task does not exist", async () => {
      mockTaskRepository.exists.mockResolvedValue(false);

      await expect(
        taskService.updateValidation({ id: 5, userId: 3 } as any),
      ).rejects.toThrow("Task does not exist");
    });
  });

  describe("deleteValidation", () => {
    it("should pass if task exists", async () => {
      mockTaskRepository.exists.mockResolvedValue(true);

      await expect(
        taskService.deleteValidation(1, { id: 2 }),
      ).resolves.not.toThrow();
    });

    it("should throw error if task does not exist", async () => {
      mockTaskRepository.exists.mockResolvedValue(false);

      await expect(taskService.deleteValidation(1, { id: 2 })).rejects.toThrow(
        "Task does not exist",
      );
    });
  });
});
