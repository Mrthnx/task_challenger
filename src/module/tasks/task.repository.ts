import { BaseRepository } from "../base/base.repository";
import { Task } from "./task.entity";
import { dataSource } from "../../config/database";

export default class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(dataSource.getRepository(Task));
  }
}
