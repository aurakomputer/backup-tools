import { $ } from "bun";
import path from "path";
import moment from "moment";
import fs from "fs";

export default class mariadb {
  client: any;
  config: any;

  constructor(client: any, config: any) {
    this.client = client;
    this.config = config;
  }

  async run() {
    let databases = [];
    if (this.client.databases) {
      databases = this.client.databases.split(",");
    } else if (this.client.database) {
      databases = [this.client.database];
    }
    for (const database of databases) {
      console.log(`-- start backup mariadb ${database}`);
      const backupFile = path.join(
        this.config.backupDir,
        "mariadb",
        `${database}-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql.gz`,
      );

      // Pastikan folder backup sudah ada
      const backupDir = path.dirname(backupFile);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      await $`mariadb-dump -u ${this.client.user} -p${this.client.password} -h ${this.client.host} -P ${this.client.port} --databases ${database} --single-transaction | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- finish backup mariadb ${database}\x1b[0m`);
    }
  }
}
