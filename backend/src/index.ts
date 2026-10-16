import "dotenv/config";
import { buildApp } from "./app.js";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

async function main() {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || "0.0.0.0";

  const app = await buildApp();

  await app.ready();

  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === "true";

  const swaggerGenerateFile =
    process.env.SWAGGER_GENERATE_FILE === "true";

  if (swaggerEnabled && swaggerGenerateFile) {
    const swagger = app.swagger();

    const docsPath = path.join(
      process.cwd(),
      "docs"
    );

    await mkdir(docsPath, {
      recursive: true,
    });

    const swaggerFile = path.join(
      docsPath,
      "swagger.json"
    );

    await writeFile(
      swaggerFile,
      JSON.stringify(swagger, null, 2),
      "utf-8"
    );

    console.log(
      `Swagger gerado em: ${swaggerFile}`
    );
  }

  await app.listen({
    port,
    host,
  });

  console.log(
    `API running on http://${host}:${port}`
  );

  if (swaggerEnabled) {
    console.log(
      `Swagger UI: http://localhost:${port}/docs`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



// import "dotenv/config";
// import { buildApp } from "./app.js";

// async function main() {
//   const port = Number(process.env.PORT) || 3000;
//   const host = process.env.HOST || "0.0.0.0";

//   const app = await buildApp();

//   await app.listen({ port, host });
//   console.log(`API running on http://${host}:${port}`);
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
