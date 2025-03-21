import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: true,
  })
  state: boolean;

  @CreateDateColumn({
    nullable: true,
    name: "create_date",
  })
  createDate?: Date;

  @UpdateDateColumn({
    nullable: true,
    name: "update_date",
  })
  updateDate?: Date;

  constructor(id: number | null) {
    this.id = id;
    this.state = true;
  }
}
