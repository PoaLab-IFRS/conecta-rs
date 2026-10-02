import cors from "@fastify/cors";
import Fastify from "fastify";
import { routes } from "./routes/index.js";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { handleInternalServerError } from "./lib/errors.js";

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(cors);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "PoaLab: School Inventory",
        version: "1.0.0",
      },
    },
    // transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler((err, _request, reply) => {
    handleInternalServerError(err, reply);
  });

  return app;
}
