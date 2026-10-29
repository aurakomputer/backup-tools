import { $ } from "bun";
import moment from "moment";
import { generateBackupFilePath, getDatabases } from "../utils";
import type { BaseClientConfig, Config, ClientRunner } from "../types";

export default class Mariadb implements ClientRunner {
  constructor(
    private client: BaseClientConfig,
    private config: Config,
  ) {}

  async run(): Promise<string[]> {
    const databases = getDatabases(this.client);
    const backupFiles: string[] = [];

    for (const database of databases) {
      console.log(`-- Start backup MariaDB: ${database}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${database}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.sql.gz`,
      );

      await $`mariadb-dump -u ${this.client.user} -p${this.client.password} -h ${this.client.host} -P ${this.client.port} --databases ${database} --single-transaction | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- Finish backup MariaDB: ${database}\x1b[0m`);
      backupFiles.push(backupFile);
    }

    return backupFiles;
  }
}
