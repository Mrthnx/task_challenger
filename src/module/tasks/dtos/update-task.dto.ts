import { IsString, IsBoolean, IsOptional, IsInt, IsPositive } from "class-validator";

export class UpdateTaskDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean = false;

  @IsInt()
  @IsPositive()
  userId: number;

  constructor(data?: Partial<UpdateTaskDto>) {
    Object.assign(this, data);
  }
}
