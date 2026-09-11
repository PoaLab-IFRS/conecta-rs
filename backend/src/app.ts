import cors from "@fastify/cors";
import Fastify from "fastify";
import { routes } from "./routes/index.js";

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(cors);
  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler((err, _request, reply) => {
    console.error(err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  });

  return app;
}
