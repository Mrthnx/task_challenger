import { Repository } from "typeorm";

import { BaseEntity } from "../../../src/module/base/base.entity";
import { BaseRepository } from "../../../src/module/base/base.repository";

describe("BaseRepository", () => {
  let repositoryMock: jest.Mocked<Repository<BaseEntity>>;
  let baseRepo: BaseRepository<BaseEntity>;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
    } as unknown as jest.Mocked<Repository<BaseEntity>>;

    baseRepo = new BaseRepository<BaseEntity>(repositoryMock);
  });

  it("should create entity", () => {
    const entity = {} as BaseEntity;
    repositoryMock.create.mockReturnValue(entity);

    const result = baseRepo.create(entity);
    expect(result).toBe(entity);
    expect(repositoryMock.create).toHaveBeenCalledWith(entity);
  });

  it("should return true if entity exists", async () => {
    repositoryMock.exists.mockResolvedValue(true);

    const result = await baseRepo.exists({ where: { id: 1 } });
    expect(result).toBe(true);
    expect(repositoryMock.exists).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should find all entities", async () => {
    const mockEntities = [{ id: 1 }, { id: 2 }] as BaseEntity[];
    repositoryMock.find.mockResolvedValue(mockEntities);

    const result = await baseRepo.findAll({ id: 1 });
    expect(result).toEqual(mockEntities);
    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: undefined,
    });
  });

  it("should find one entity", async () => {
    const mockEntity = { id: 1 } as BaseEntity;
    repositoryMock.findOne.mockResolvedValue(mockEntity);

    const result = await baseRepo.findOne({ id: 1 });
    expect(result).toEqual(mockEntity);
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: undefined,
    });
  });

  it("should save entity", async () => {
    const entity = { id: 1 } as BaseEntity;
    repositoryMock.save.mockResolvedValue(entity);

    const result = await baseRepo.save(entity);
    expect(result).toBe(entity);
    expect(repositoryMock.save).toHaveBeenCalledWith(entity);
  });

  it("should soft delete entity by id", async () => {
    const updateResult = { affected: 1 } as any;
    repositoryMock.update.mockResolvedValue(updateResult);

    const result = await baseRepo.delete(1);
    expect(result).toBe(updateResult);
    expect(repositoryMock.update).toHaveBeenCalledWith(
      { id: 1 },
      { id: 1, state: false },
    );
  });
});
