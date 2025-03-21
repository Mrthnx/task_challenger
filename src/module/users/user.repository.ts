import { injectable } from "inversify";
import { BaseRepository } from "../base/base.repository";
import { User } from "./user.entity";
import { dataSource } from "../../config/database";

@injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(dataSource.getRepository(User));
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ where: { email } });
  }
}
