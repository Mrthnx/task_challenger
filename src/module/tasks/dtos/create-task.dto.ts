import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  userId: number;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean = false;

  constructor(data?: Partial<CreateTaskDto>) {
    Object.assign(this, data);
  }
}
