import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
