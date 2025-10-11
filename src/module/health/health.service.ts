import { injectable } from "inversify";
import { dataSource } from "../../config/database";
import { loggerApp } from "../../config/logger";

const logger = loggerApp("HealthService");

@injectable()
export class HealthService {
  async check() {
    const startTime = Date.now();
    
    // Check database connection
    let databaseStatus = "disconnected";
    try {
      if (dataSource.isInitialized) {
        await dataSource.query("SELECT 1");
        databaseStatus = "connected";
      }
    } catch (error) {
      logger.error({ error }, "Database health check failed");
      databaseStatus = "error";
    }

    return {
      status: databaseStatus === "connected" ? "ok" : "degraded",
      database: databaseStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.5.0",
      responseTime: Date.now() - startTime,
    };
  }
}
