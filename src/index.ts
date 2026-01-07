const configPath = process.argv[2] || "../config.json";
const config = await import(configPath, { assert: { type: "json" } }).then(
  (m) => m.default,
);

async function run(client: any) {
  const modulePath = `./clients/${client.type}.ts`;
  const module = await import(modulePath);
  const instance = new module.default(client);
  await instance.run();
}

export async function main() {
  for (const client of config.clients) {
    await run(client);
  }
}

if (import.meta.main) {
  main();
}
