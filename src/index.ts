import type { Config, BaseClientConfig, UploaderConfig } from "./types";

const configPath = process.argv[2] || "../config.json";
console.log(`Loading config from: ${configPath}`);

const config: Config = await import(configPath, {
  assert: { type: "json" },
}).then((m) => m.default);

async function upload(uploader: UploaderConfig, backupFile: string) {
  try {
    const modulePath = `./uploaders/${uploader.type}.ts`;
    const module = await import(modulePath);
    const instance = new module.default(backupFile, uploader);
    await instance.upload();
  } catch (error) {
    console.error(
      `[UPLOAD ERROR] Uploader ${uploader.type} gagal untuk file ${backupFile}:`,
      error,
    );
  }
}

async function runClient(client: BaseClientConfig) {
  const modulePath = `./clients/${client.type}.ts`;
  const module = await import(modulePath);
  const instance = new module.default(client, config);
  const backupFiles: string[] = await instance.run();

  // Unggah file secara paralel ke seluruh uploaders
  for (const backupFile of backupFiles) {
    const uploadTasks = config.uploaders.map((uploader) =>
      upload(uploader, backupFile),
    );
    await Promise.allSettled(uploadTasks);
  }
}

export async function main() {
  for (const client of config.clients) {
    await runClient(client);
  }
}

if (import.meta.main) {
  main();
}
