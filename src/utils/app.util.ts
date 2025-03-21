import { BaseController } from "../module/base/base.controller";
import { Response } from "express";
import AppError from "./app.error";

export const isNewEntity = (entity: { id: number | null }): boolean => {
  return entity == null || !isValidNumberAsId(entity.id);
};

export const isValidNumberAsId = (
  idNumber: number | null | undefined,
): boolean => {
  return idNumber != null && typeof idNumber !== "undefined" && idNumber > 0;
};

export const isEmptyString = (value: string | undefined) => {
  return value == null || value.length === 0;
};
export const isEmptyStringAndNotNull = (value: string | undefined) => {
  return value != null && value.trim().length === 0;
};

export const isEmptyArray = <T>(value: T[] | undefined) => {
  return value == null || value.length === 0;
};

export const isUnaryArray = <T>(value: T[] | undefined) => {
  return !isEmptyArray(value) && value?.length === 1;
};

export const isBlankString = (value: string | undefined) => {
  return isEmptyString(value) || isEmptyString(value?.trim());
};

export const parseSecureInt = (value: number | undefined) => {
  const parseValue = parseInt(String(value), 10);
  if (isNaN(parseValue)) {
    throw new Error("Invalid number");
  }
  return parseValue;
};

export const handleRequest = async (
  fn: () => Promise<unknown>,
  response: Response,
) => {
  try {
    await fn();
  } catch (e: unknown) {
    if (e instanceof AppError) {
      BaseController.returnErrorResponse(response, e.message, e.status);
    } else {
      BaseController.returnErrorResponse(response, (e as Error).message);
    }
  }
};
