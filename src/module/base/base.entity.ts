import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
