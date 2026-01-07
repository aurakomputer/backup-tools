import moment from "moment";
import path from "path";
import fs from "fs";

export function getDatabases(client: any) {
  let databases = [];
  if (client.databases) {
    if (typeof client.databases === "string") {
      databases = client.databases.split(",");
    } else if (Array.isArray(client.databases)) {
      databases = client.databases;
    }
  } else if (client.database) {
    databases = [client.database];
  }
  return databases;
}

export function generateBackupFilePath(
  config: any,
  client: any,
  fileName: string,
) {
  const backupPath = path.join(
    config.backupDir,
    client.type,
    moment().format("YYYY-MM-DD"),
    fileName,
  );

  // Pastikan folder backup sudah ada
  const backupDir = path.dirname(backupPath);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  return backupPath;
}
