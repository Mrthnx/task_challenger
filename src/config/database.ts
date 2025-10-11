import { DataSource, type DataSourceOptions } from "typeorm";
import { ENV } from "./environment";
import { join } from "path";

const config: DataSourceOptions = {
  type: (ENV.DATABASE.TYPE || "postgres") as "postgres" | "mysql",
  charset: "utf8mb4",
  host: ENV.DATABASE.HOST,
  port: parseInt(ENV.DATABASE.PORT || "5432"),
  username: ENV.DATABASE.USERNAME,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.NAME,
  extra: {
    connectionLimit: ENV.DATABASE.MAX_POOL_SIZE,
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
  logging: ENV.DATABASE.LOGGING === "true" && ENV.NODE_ENV !== "production",
  synchronize: true,
  migrationsRun: true,
  timezone: "+00:00",
  entities: [join(__dirname, "/../module/**/**.entity{.ts,.js}")],
  migrations: [join(__dirname + "/../migrations/**/*{.ts,.js}")],
};

export const dataSource = new DataSource(config);
