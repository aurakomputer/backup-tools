import { $ } from "bun";
import path from "path";
import moment from "moment";
import fs from "fs";

export default class postgresql {
  client: any;

  constructor(client: any) {
    this.client = client;
  }

  async run() {
    let databases = [];
    if (this.client.databases) {
      databases = this.client.databases.split(",");
    } else if (this.client.database) {
      databases = [this.client.database];
    }
    for (const database of databases) {
      console.log(`-- start backup postgresql ${database}`);
      const backupFile = path.join(
        process.cwd(),
        "backups",
        "postgresql",
        `${database}-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql.gz`,
      );

      // Pastikan folder backup sudah ada
      const backupDir = path.dirname(backupFile);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Jalankan pg_dump dan kompres dengan gzip
      await $`PGPASSWORD=${this.client.password} pg_dump -U ${this.client.user} -h ${this.client.host} -p ${this.client.port} -d ${database} --format=plain | gzip > ${backupFile}`;

      console.log(`\x1b[32m-- finish backup postgresql ${database}\x1b[0m`);
    }
  }
}
