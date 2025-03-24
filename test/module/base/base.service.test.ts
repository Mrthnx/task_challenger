import { HTTP_CODE_NOT_FOUND } from "../../../src/config/constants";
import { BaseEntity } from "../../../src/module/base/base.entity";
import { BaseRepository } from "../../../src/module/base/base.repository";
import { BaseService } from "../../../src/module/base/base.service";
import AppError from "../../../src/utils/app.error";

class TestEntity extends BaseEntity {
  name!: string;
}

type TestViewModel = { name: string; id?: number };

describe("BaseService", () => {
  let repositoryMock: jest.Mocked<BaseRepository<TestEntity>>;
  let service: BaseService<TestEntity, TestViewModel>;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    } as any;

    service = new BaseService<TestEntity, TestViewModel>(repositoryMock);
  });

  describe("create", () => {
    it("should create and return view model", async () => {
      const viewModel: TestViewModel = { name: "Test" };
      const entity = { id: 1, name: "Test", state: true } as TestEntity;

      repositoryMock.create.mockReturnValue(entity);
      repositoryMock.save.mockResolvedValue(entity);

      const result = await service.create(viewModel);

      expect(repositoryMock.create).toHaveBeenCalled();
      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual({ id: 1, name: "Test", state: true });
    });
  });

  describe("update", () => {
    it("should update and return view model", async () => {
      const viewModel = { name: "Updated" };
      const existingEntity = { id: 1, name: "Old", state: true } as TestEntity;
      const updatedEntity = {
        id: 1,
        name: "Updated",
        state: true,
      } as TestEntity;

      repositoryMock.findOne.mockResolvedValue(existingEntity);
      repositoryMock.create.mockReturnValue(updatedEntity);
      repositoryMock.save.mockResolvedValue(updatedEntity);

      const result = await service.update(1, viewModel);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        id: 1,
        state: true,
      });
      expect(repositoryMock.save).toHaveBeenCalledWith(updatedEntity);
      expect(result).toEqual(updatedEntity);
    });
  });

  describe("getByKey", () => {
    it("should return view model if found", async () => {
      const entity = { id: 1, name: "Entity" } as TestEntity;
      repositoryMock.findOne.mockResolvedValue(entity);

      const result = await service.getByKey(1);

      expect(result).toEqual(entity);
    });

    it("should throw AppError if not found", async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(service.getByKey(99)).rejects.toThrow(AppError);
      await expect(service.getByKey(99)).rejects.toThrow(
        "Entity does not exist",
      );
    });
  });

  describe("getAll", () => {
    it("should map all entities to view models", async () => {
      const entities = [
        { id: 1, name: "One" },
        { id: 2, name: "Two" },
      ] as TestEntity[];

      repositoryMock.findAll.mockResolvedValue(entities);

      const result = await service.getAll({ state: true });

      expect(result).toEqual(entities);
      expect(repositoryMock.findAll).toHaveBeenCalledWith(
        { state: true },
        undefined,
      );
    });
  });

  describe("delete", () => {
    it("should delete entity if it exists", async () => {
      repositoryMock.exists.mockResolvedValue(true);
      repositoryMock.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(repositoryMock.exists).toHaveBeenCalledWith({
        where: { id: 1, state: true },
      });
      expect(repositoryMock.delete).toHaveBeenCalledWith(1);
    });

    it("should throw AppError if entity does not exist", async () => {
      repositoryMock.exists.mockResolvedValue(false);

      await expect(service.delete(999)).rejects.toThrow(AppError);
      await expect(service.delete(999)).rejects.toThrow(
        "Entity does not exist",
      );
    });
  });
});
