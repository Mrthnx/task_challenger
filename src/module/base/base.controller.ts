import { injectable, unmanaged } from "inversify";
import { BaseService } from "./base.service";
import { BaseEntity } from "./base.entity";
import { Controller } from "./controller";
import { handleRequest, parseSecureInt } from "../../utils/app.util";
import { Request, Response } from "express";
import { AppRequest } from "../../utils/app.interfaces";

@injectable()
export class BaseController<
  Entity extends BaseEntity,
  ViewModel,
> extends Controller {
  constructor(
    @unmanaged() private readonly service: BaseService<Entity, ViewModel>,
  ) {
    super();
  }

  configureRoutes() {
    this.extraRoutesConfiguration();
    this.router.get("/:id", this.getByKey);
    this.router.post("/", this.create);
    this.router.put("/:id", this.update);
    this.router.delete("/:id", this.delete);
    return this.router;
  }

  extraRoutesConfiguration() {
    return;
  }

  protected getByKey = async (request: Request, response: Response) => {
    handleRequest(async () => {
      const entity = await this.service.getByKey(
        parseSecureInt(+request.params.id),
      );
      BaseController.returnOkResponse(response, entity);
    }, response);
  };

  protected create = async (request: AppRequest, response: Response) => {
    handleRequest(async () => {
      const entity = await this.service.create({
        ...request.body,
        userId: request.user.id,
      });
      BaseController.returnOkResponse(response, entity);
    }, response);
  };

  protected update = async (request: AppRequest, response: Response) => {
    handleRequest(async () => {
      const entity = await this.service.update(
        parseSecureInt(+request.params.id),
        {
          ...request.body,
          userId: request.user.id,
        },
      );
      BaseController.returnOkResponse(response, entity);
    }, response);
  };

  protected delete = async (request: AppRequest, response: Response) => {
    handleRequest(async () => {
      await this.service.delete(
        parseSecureInt(+request.params.id),
        request.user,
      );
      BaseController.returnOkEmptyResponse(response);
    }, response);
  };
}
