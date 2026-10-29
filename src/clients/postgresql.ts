import { $ } from "bun";
import moment from "moment";
import { generateBackupFilePath, getDatabases } from "../utils";
import type { BaseClientConfig, Config, ClientRunner } from "../types";

export default class Postgresql implements ClientRunner {
  constructor(
    private client: BaseClientConfig,
    private config: Config,
  ) {}

  async run(): Promise<string[]> {
    const databases = getDatabases(this.client);
    const backupFiles: string[] = [];

    for (const database of databases) {
      console.log(`-- Start backup PostgreSQL: ${database}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${database}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.sql.gz`,
      );

      await $`PGPASSWORD=${this.client.password} pg_dump -U ${this.client.user} -h ${this.client.host} -p ${this.client.port} -d ${database} --format=plain | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- Finish backup PostgreSQL: ${database}\x1b[0m`);
      backupFiles.push(backupFile);
    }

    return backupFiles;
  }
}
