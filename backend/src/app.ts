import cors from "@fastify/cors";
import Fastify from "fastify";
import { routes } from "./routes/index.js";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

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
    console.error(err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  });

  return app;
}
