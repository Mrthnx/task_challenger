import * as express from "express";
import type { Application } from "express";
import { injectable } from "inversify";
import cors from "cors";
import { ENV } from "./environment";

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
    const allowedOrigins = ENV.NODE_ENV === "dev" ? "*" : /vercel\.app$/;

    app.use(cors());
  }
}
