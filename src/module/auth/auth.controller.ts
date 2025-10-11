import { inject, injectable } from "inversify";
import { Response, Request } from "express";
import { Controller } from "../base/controller";
import { validationSchema } from "../../utils/app.middleware";
import { AuthRequestDto } from "./dtos/auth.request.dto";
import { handleRequest } from "../../utils/app.util";
import { TYPES } from "../../config/types";
import { AuthService } from "./auth.service";
import { SignUpRequestDto } from "./dtos/sign-up.request.dto";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

@injectable()
export class AuthController extends Controller {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  configureRoutes() {
    this.router.post("/login", [authLimiter, validationSchema(AuthRequestDto)], this.login);
    this.router.post(
      "/register",
      [authLimiter, validationSchema(SignUpRequestDto)],
      this.register,
    );
    return this.router;
  }

  private readonly login = async (request: Request, response: Response) => {
    handleRequest(async () => {
      const resp = await this.authService.login(request.body);
      AuthController.returnOkResponse(response, resp);
    }, response);
  };

  private readonly register = async (request: Request, response: Response) => {
    handleRequest(async () => {
      const resp = await this.authService.register(request.body);
      AuthController.returnOkResponse(response, resp);
    }, response);
  };
}
