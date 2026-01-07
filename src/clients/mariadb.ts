import { $ } from "bun";
import path from "path";
import moment from "moment";
import fs from "fs";

export default class mariadb {
  client: any;

  constructor(client: any) {
    this.client = client;
  }

  async run() {
    console.log("running mariadb");

    let databases = [];
    if (this.client.databases) {
      databases = this.client.databases.split(",");
    } else if (this.client.database) {
      databases = [this.client.database];
    }
    for (const database of databases) {
      const backupFile = path.join(
        process.cwd(),
        "backups",
        "mariadb",
        `${database}-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql.gz`,
      );

      // Pastikan folder backup sudah ada
      const backupDir = path.dirname(backupFile);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      console.log(backupFile);

      await $`mariadb-dump -u ${this.client.user} -p${this.client.password} -h ${this.client.host} -P ${this.client.port} --databases ${database} --single-transaction | gzip > ${backupFile}`;
    }
  }
}
