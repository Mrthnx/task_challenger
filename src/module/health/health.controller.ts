import { inject, injectable } from "inversify";
import { Response, Request } from "express";
import { Controller } from "../base/controller";
import { handleRequest } from "../../utils/app.util";
import { TYPES } from "../../config/types";
import { HealthService } from "./health.service";

@injectable()
export class HealthController extends Controller {
  constructor(
    @inject(TYPES.HealthService)
    private readonly healthService: HealthService,
  ) {
    super();
  }

  configureRoutes() {
    this.router.get("/", this.health);
    return this.router;
  }

  private readonly health = async (_: Request, response: Response) => {
    handleRequest(async () => {
      const healthStatus = await this.healthService.check();
      HealthController.returnOkResponse(response, healthStatus);
    }, response);
  };
}
