import dotenv from "dotenv";

dotenv.config();

const EXPIRES_IN_SEC = 3600;

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
