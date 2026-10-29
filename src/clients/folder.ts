import { $ } from "bun";
import moment from "moment";
import path from "path";
import fs from "fs";
import { generateBackupFilePath } from "../utils";
import type { Config, ClientRunner } from "../types";

export default class Folder implements ClientRunner {
  constructor(
    private client: any,
    private config: Config,
  ) {}

  private getPaths(): string[] {
    if (this.client.paths) {
      if (typeof this.client.paths === "string") {
        return this.client.paths.split(",").map((p: string) => p.trim());
      }
      if (Array.isArray(this.client.paths)) {
        return this.client.paths;
      }
    }
    if (this.client.path) {
      return [this.client.path];
    }
    return [];
  }

  async run(): Promise<string[]> {
    const targetPaths = this.getPaths();
    const backupFiles: string[] = [];

    for (const targetPath of targetPaths) {
      if (!fs.existsSync(targetPath)) {
        console.error(
          `\x1b[31m[SKIP] Path tidak ditemukan: ${targetPath}\x1b[0m`,
        );
        continue;
      }

      // Ambil nama folder/file akhir untuk penamaan arsip
      const folderName = path.basename(path.resolve(targetPath));
      const parentDir = path.dirname(path.resolve(targetPath));

      console.log(`-- Start archiving folder/file: ${targetPath}`);
      const backupFile = generateBackupFilePath(
        this.config,
        this.client,
        `${folderName}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.tar.gz`,
      );

      // Opsi exclude jika ada
      const excludeFlags: string[] = [];
      if (Array.isArray(this.client.exclude)) {
        for (const item of this.client.exclude) {
          excludeFlags.push(`--exclude=${item}`);
        }
      }

      // Menggunakan tar dengan flag -C agar struktur path di dalam tar.gz relatif terhadap parent dir
      await $`tar ${excludeFlags} -czf ${backupFile} -C ${parentDir} ${folderName}`;

      console.log(
        `\x1b[32m-- Finish archiving: ${folderName} -> ${backupFile}\x1b[0m`,
      );
      backupFiles.push(backupFile);
    }

    return backupFiles;
  }
}
