import "dotenv/config";
import { buildApp } from "./app.js";

async function main() {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || "0.0.0.0";

  const app = await buildApp();

  await app.listen({ port, host });
  console.log(`API running on http://${host}:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
