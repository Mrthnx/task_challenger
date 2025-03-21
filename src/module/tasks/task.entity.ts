import { Entity, Column, Relation, ManyToOne } from "typeorm";
import { BaseEntity } from "../base/base.entity";
import { User } from "../users/user.entity";

@Entity({ name: "tasks" })
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.tasks)
  user: Relation<User>;
}
