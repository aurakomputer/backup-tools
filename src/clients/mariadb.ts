import { $ } from "bun";
import path from "path";
import moment from "moment";

export default class MamriaDB {
  async run() {
    console.log("running mariadb");

    const config = {
      host: process.env.MARIADB_HOST,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
    };

    const backupFile = path.join(
      process.cwd(),
      "backups",
      "mariadb",
      `backup-${moment().format("YYYY-MM-DD HH-mm-ss")}.sql`,
    );

    console.log(backupFile);

    $`mariadb-dump -u ${config.user} -p${config.password} -h ${config.host} -P 3306 --databases ${config.database} --skip-lock-tables --skip-comments --skip-add-drop-table --routines --triggers --events --single-transaction --hex-blob --complete-insert --lock-all-tables --databases ${config.database} > ${backupFile}`;
  }
}
