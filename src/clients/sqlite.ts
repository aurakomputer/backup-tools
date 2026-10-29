import { $ } from "bun";
import moment from "moment";
import path from "path";
import { generateBackupFilePath, getDatabases } from "../utils";
import type { Config, ClientRunner } from "../types";

export default class Sqlite implements ClientRunner {
  constructor(
    private client: any,
    private config: Config,
  ) {}

  async run(): Promise<string[]> {
    const databases = getDatabases(this.client);
    const backupFiles: string[] = [];

    for (const dbPath of databases) {
      // Ambil nama file tanpa ekstensi untuk penamaan file backup
      const dbName = path.basename(dbPath, path.extname(dbPath));

      console.log(`-- Start backup SQLite: ${dbPath}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${dbName}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.sql.gz`,
      );

      // Menggunakan perintah .dump dari sqlite3 CLI yang di-stream ke gzip
      await $`sqlite3 ${dbPath} ".dump" | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- Finish backup SQLite: ${dbName}\x1b[0m`);
      backupFiles.push(backupFile);
    }

    return backupFiles;
  }
}
