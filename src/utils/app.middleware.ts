import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
} from "../config/constants";
import { verifyToken } from "./app.jwt";
import { AppRequest, UserRequest } from "./app.interfaces";

export const validationSchema = (dtoClass: ClassConstructor<Object>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    const errors = await validate(output);

    if (errors.length) {
      const formattedErrors = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      res.status(HTTP_CODE_BAD_REQUEST).json({ errors: formattedErrors });
      return;
    }

    next();
  };
};

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(HTTP_CODE_UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as AppRequest).user = decoded as UserRequest;
    next();
  } catch (error) {
    res.status(HTTP_CODE_UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }
};
