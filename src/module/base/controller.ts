import { Router, Response } from "express";
import { injectable } from "inversify";
import {
  HTTP_CODE_OK,
  HTTP_CODE_NO_CONTENT,
  HTTP_CODE_INTERNAL_ERROR,
} from "../../config/constants";
import { loggerApp } from "../../config/logger";

const logger = loggerApp("Controller");

@injectable()
export class Controller {
  static returnOkResponse(res: Response, body: unknown): Response {
    return res.status(HTTP_CODE_OK).json({ data: body });
  }

  static returnOkEmptyResponse(res: Response): Response {
    return res.status(HTTP_CODE_NO_CONTENT).json({ data: {} });
  }

  static returnErrorResponse(res: Response, message: string, status?: number) {
    return res.status(status || HTTP_CODE_INTERNAL_ERROR).json({ message });
  }

  private readonly _router: Router;

  constructor() {
    this._router = Router();
  }

  configureRoutes(): void {
    logger.error("Controller not configured");
    throw new Error("Not implemented!");
  }

  get router() {
    return this._router;
  }
}
