import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742530070157 implements MigrationInterface {
  name = "initUserTask1742530070157";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "state" boolean NOT NULL DEFAULT true, "createDate" TIMESTAMP DEFAULT now(), "updateDate" TIMESTAMP DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "isCompleted" boolean NOT NULL, "userId" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "state" boolean NOT NULL DEFAULT true, "createDate" TIMESTAMP DEFAULT now(), "updateDate" TIMESTAMP DEFAULT now(), "email" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
  }
}
