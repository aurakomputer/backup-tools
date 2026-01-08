import { $ } from "bun";
import moment from "moment";
import { generateBackupFilePath, getDatabases } from "../utils";

export default class postgresql {
  client: any;
  config: any;

  constructor(client: any, config: any) {
    this.client = client;
    this.config = config;
  }

  async run() {
    let databases = getDatabases(this.client);

    for (const database of databases) {
      console.log(`-- start backup postgresql ${database}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${database}-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql.gz`,
      );

      await $`PGPASSWORD=${this.client.password} pg_dump -U ${this.client.user} -h ${this.client.host} -p ${this.client.port} -d ${database} --format=plain | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- finish backup postgresql ${database}\x1b[0m`);

      return backupFile;
    }
  }
}
