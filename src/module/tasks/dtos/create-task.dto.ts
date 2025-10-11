import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  userId: number;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean = false;

  constructor(data?: Partial<CreateTaskDto>) {
    Object.assign(this, data);
  }
}
