import * as express from "express";
import type { Application } from "express";
import { injectable } from "inversify";
import cors from "cors";

@injectable()
export class WebConfiguration {
  configure(app: Application) {
    this.configureBodyParser(app);
    this.configureCors(app);
  }

  private configureBodyParser(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded());
  }

  private configureCors(app: Application) {
    app.use(cors());
    // app.use(function (_, res, next) {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header("Access-Control-Allow-Methods", "*");
    //   next();
    // });
  }
}
