import { injectable, unmanaged } from "inversify";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";
import { BaseEntity } from "./base.entity";

@injectable()
export class BaseRepository<Entity extends BaseEntity> {
  constructor(@unmanaged() private readonly repository: Repository<Entity>) {}

  create(entity: Entity): Entity {
    return this.repository.create(entity);
  }

  async exists({ where }: FindManyOptions<Entity>): Promise<boolean> {
    return this.repository.exists({ where });
  }

  async findAll(
    where: FindOptionsWhere<Entity>,
    relations?: string[],
    order?: FindOptionsOrder<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      where,
      relations,
      order,
    });
  }

  async findOne(
    where: FindOptionsWhere<Entity>,
    relations?: string[],
  ): Promise<Entity | null> {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async save(entity: Entity): Promise<Entity> {
    return await this.repository.save(entity);
  }

  async delete(id: number) {
    return await this.repository.softDelete(id);
  }

  async restore(id: number) {
    return await this.repository.restore(id);
  }
}
