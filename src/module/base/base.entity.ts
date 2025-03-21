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
  })
  createDate?: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updateDate?: Date;

  constructor(id: number | null) {
    this.id = id;
    this.state = true;
  }
}
