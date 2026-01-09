import { $ } from "bun";
import moment from "moment";
import { generateBackupFilePath, getDatabases } from "../utils";

export default class mariadb {
  client: any;
  config: any;

  constructor(client: any, config: any) {
    this.client = client;
    this.config = config;
  }

  async run(): Promise<string[]> {
    let databases = getDatabases(this.client);

    let backupFiles: string[] = [];
    for (const database of databases) {
      console.log(`-- start backup mariadb ${database}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${database}-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql.gz`,
      );

      await $`mariadb-dump -u ${this.client.user} -p${this.client.password} -h ${this.client.host} -P ${this.client.port} --databases ${database} --single-transaction | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- finish backup mariadb ${database}\x1b[0m`);

      backupFiles.push(backupFile);
    }

    return backupFiles;
  }
}
