import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "dev";

const EXPIRES_IN_SEC = 3600;

const schema = Joi.object({
  NODE_ENV: Joi.string().required(),
  APP: Joi.object({
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.number().default(EXPIRES_IN_SEC),
  }).required(),
  DATABASE: Joi.object({
    TYPE: Joi.string().required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().required(),
    USERNAME: Joi.string().required(),
    PASSWORD: Joi.string().required(),
    NAME: Joi.string().required(),
    MAX_POOL_SIZE: Joi.number().required(),
    LOGGING: Joi.boolean().required(),
  }).required(),
});

const { error } = schema.validate({
  NODE_ENV: process.env.NODE_ENV,
  APP: {
    PORT: process.env.APP_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? EXPIRES_IN_SEC,
  },
  DATABASE: {
    TYPE: process.env.DATABASE_TYPE,
    HOST: process.env.DATABASE_HOST,
    PORT: process.env.DATABASE_PORT,
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    NAME: process.env.DATABASE_NAME,
    MAX_POOL_SIZE: process.env.DATABASE_MAX_POOL_SIZE,
    LOGGING: process.env.DATABASE_LOGGING,
  },
});

if (error && NODE_ENV !== "test") {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  APP: {
    PORT: process.env.APP_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? EXPIRES_IN_SEC,
  },
  DATABASE: {
    TYPE: process.env.DATABASE_TYPE,
    HOST: process.env.DATABASE_HOST,
    PORT: process.env.DATABASE_PORT,
    USERNAME: process.env.DATABASE_USERNAME,
    PASSWORD: process.env.DATABASE_PASSWORD,
    NAME: process.env.DATABASE_NAME,
    MAX_POOL_SIZE: process.env.DATABASE_MAX_POOL_SIZE,
    LOGGING: process.env.DATABASE_LOGGING,
  },
};
