import { injectable, unmanaged } from "inversify";
import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { BaseRepository } from "./base.repository";
import { BaseEntity } from "./base.entity";
import { HTTP_CODE_NOT_FOUND } from "../../config/constants";
import AppError from "../../utils/app.error";

@injectable()
export class BaseService<Entity extends BaseEntity, ViewModel> {
  constructor(
    @unmanaged() private readonly repository: BaseRepository<Entity>,
  ) {}

  async create(viewModel: ViewModel) {
    const viewModelToCreate = await this.createValidation(viewModel);
    const entityToCreate = this.repository.create({
      ...viewModelToCreate,
    } as unknown as Entity);
    const entity = await this.repository.save(entityToCreate);
    return this.mapToViewModel(entity);
  }

  async update(id: number, viewModel: ViewModel) {
    const viewModelToUpdate = await this.updateValidation({ ...viewModel, id });
    const entityFind = await this.repository.findOne({
      id,
      state: true,
    } as FindOptionsWhere<Entity>);
    const entityToUpdate = this.repository.create({
      ...entityFind,
      ...viewModelToUpdate,
      id,
    } as unknown as Entity);
    const entity = await this.repository.save(entityToUpdate);
    return this.mapToViewModel(entity);
  }

  async getByKey(
    id: number,
    where?: FindOptionsWhere<Entity>,
  ): Promise<ViewModel> {
    const entity = await this.repository.findOne({
      id,
      ...where,
    } as FindOptionsWhere<Entity>);
    if (!entity) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "Entity does not exist");
    }
    return this.mapToViewModel(entity);
  }

  async getAll(
    where: FindOptionsWhere<Entity>,
    relations?: string[],
  ): Promise<ViewModel[]> {
    const entities = await this.repository.findAll(where, relations);
    return entities.map((entity) => this.mapToViewModel(entity));
  }

  async delete(id: number, options?: unknown): Promise<void> {
    await this.deleteValidation(id, options);
    const existsEntity = await this.repository.exists({
      where: { id, state: true },
    } as FindManyOptions<Entity>);
    if (!existsEntity) {
      throw new AppError(HTTP_CODE_NOT_FOUND, "Entity does not exist");
    }
    await this.repository.delete(id);
  }

  protected async createValidation(viewModel: ViewModel): Promise<Entity> {
    return this.createEntity(viewModel);
  }

  protected async updateValidation(viewModel: ViewModel): Promise<Entity> {
    return this.createEntity(viewModel);
  }

  protected async deleteValidation(
    _id: number,
    _options?: unknown,
  ): Promise<void> {
    return;
  }

  protected mapToViewModel(entity: Entity): ViewModel {
    return entity as unknown as ViewModel;
  }

  private createEntity(viewModel: ViewModel): Entity {
    return this.repository.create({
      ...viewModel,
    } as unknown as Entity);
  }
}
