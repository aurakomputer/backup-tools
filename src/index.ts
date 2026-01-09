const configPath = process.argv[2] || "../config.json";
console.log(configPath);
const config = await import(configPath, { assert: { type: "json" } }).then(
  (m) => m.default,
);

/**
 * call upload function
 */
async function upload(uploader: any, backupFile: string) {
  const modulePath = `./uploaders/${uploader.type}.ts`;
  const module = await import(modulePath);
  const instance = new module.default(backupFile, uploader);
  await instance.upload();
}

/**
 * call backup client run function
 */
async function run(client: any) {
  const modulePath = `./clients/${client.type}.ts`;
  const module = await import(modulePath);
  const instance = new module.default(client, config);
  const backupFiles = await instance.run();
  for (const backupFile of backupFiles) {
    for (const uploader of config.uploaders) {
      await upload(uploader, backupFile);
    }
}

export async function main() {
  for (const client of config.clients) {
    await run(client);
  }
}

if (import.meta.main) {
  main();
}
