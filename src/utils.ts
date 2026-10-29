import moment from "moment";
import path from "path";
import fs from "fs";
import type { BaseClientConfig, Config } from "./types";

export function getDatabases(client: BaseClientConfig): string[] {
  if (client.databases) {
    if (typeof client.databases === "string") {
      return client.databases.split(",").map((db) => db.trim());
    }
    if (Array.isArray(client.databases)) {
      return client.databases;
    }
  }
  if (client.database) {
    return [client.database];
  }
  return [];
}

export function generateBackupFilePath(
  config: Config,
  client: BaseClientConfig,
  fileName: string,
): string {
  const backupPath = path.join(
    config.backupDir,
    client.type,
    moment().format("YYYY-MM-DD"),
    fileName,
  );

  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  return backupPath;
}
