import { inject } from "inversify";
import { TYPES } from "../../config/types";
import { UserRepository } from "../users/user.repository";
import { AuthRequestDto } from "./dtos/auth.request.dto";
import { signToken } from "../../utils/app.jwt";
import {
  HTTP_CODE_CONFLICT,
  HTTP_CODE_UNAUTHORIZED,
} from "../../config/constants";
import AppError from "../../utils/app.error";
import { User } from "../users/user.entity";
import { SignUpRequestDto } from "./dtos/sign-up.request.dto";

export default class AuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async login({ email }: AuthRequestDto) {
    const exist = await this.userRepository.existsByEmail(email);
    if (!exist) {
      throw new AppError(HTTP_CODE_UNAUTHORIZED, "Invalid credentials");
    }
    const user = await this.userRepository.findOne({ email });
    return {
      token: signToken({ email, id: user.id }),
      id: user.id,
      email: user.email,
    };
  }

  async register({ email }: SignUpRequestDto) {
    const exist = await this.userRepository.existsByEmail(email);
    if (exist) {
      throw new AppError(HTTP_CODE_CONFLICT, "User already exists");
    }
    const user = await this.userRepository.save({ email } as User);
    return {
      token: signToken({ email, id: user.id }),
      id: user.id,
      email: user.email,
    };
  }
}
