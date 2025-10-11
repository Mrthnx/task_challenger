import { Entity, Column, OneToMany, Relation, Index } from "typeorm";
import { Task } from "../tasks/task.entity";
import { BaseEntity } from "../base/base.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Index()
  @Column({
    unique: true,
  })
  email: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Relation<User[]>;
}
