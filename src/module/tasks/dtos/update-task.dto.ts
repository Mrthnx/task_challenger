import { IsString, IsBoolean, IsOptional } from "class-validator";

export default class UpdateTaskDto {
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

  userId: number;

  constructor(data?: Partial<UpdateTaskDto>) {
    Object.assign(this, data);
  }
}
