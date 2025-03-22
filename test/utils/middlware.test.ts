import express, { Request, Response } from "express";
import request from "supertest";
import { IsString } from "class-validator";
import jwt from "jsonwebtoken";
import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
} from "../../src/config/constants";
import {
  validationSchema,
  validateToken,
} from "../../src/utils/app.middleware";
import { verifyToken } from "../../src/utils/app.jwt";

// DTO de prueba
class SampleDTO {
  @IsString()
  name!: string;
}

// Mocks
jest.mock("../../src/utils/app.jwt", () => ({
  verifyToken: jest.fn(),
}));

describe("Middleware Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe("validationSchema", () => {
    it("debe pasar la validación y continuar", async () => {
      app.post("/test", validationSchema(SampleDTO), (req, res) => {
        res.status(200).json({ ok: true });
      });

      const res = await request(app).post("/test").send({ name: "Valid Name" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it("debe fallar la validación y retornar 400", async () => {
      app.post("/test", validationSchema(SampleDTO), (req, res) => {
        res.status(200).json({ ok: true });
      });

      const res = await request(app).post("/test").send({ name: 123 });

      expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
      expect(res.body.errors[0].property).toBe("name");
    });
  });

  describe("validateToken", () => {
    it("debe pasar si el token es válido", async () => {
      (verifyToken as jest.Mock).mockImplementation(() => ({ id: 1 }));

      app.get("/secure", validateToken, (req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      const token = jwt.sign({ id: 1 }, "secret");
      const res = await request(app)
        .get("/secure")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("debe fallar si no hay token", async () => {
      app.get("/secure", validateToken, (req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      const res = await request(app).get("/secure");

      expect(res.status).toBe(HTTP_CODE_UNAUTHORIZED);
      expect(res.body.message).toBe("Unauthorized");
    });

    it("debe fallar si el token es inválido", async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("invalid token");
      });

      app.get("/secure", validateToken, (req: Request, res: Response) => {
        res.status(200).json({ success: true });
      });

      const res = await request(app)
        .get("/secure")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(HTTP_CODE_UNAUTHORIZED);
    });
  });
});
