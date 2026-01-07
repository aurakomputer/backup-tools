import config from "../config.json";

async function run(client: any) {
  const modulePath = `./clients/${client.type}.ts`;
  const module = await import(modulePath);
  const instance = new module.default(client);
  await instance.run();
}

for (const client of config.clients) {
  await run(client);
}
