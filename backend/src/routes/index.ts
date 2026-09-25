import type { FastifyPluginAsync } from "fastify";
import { atributosRoutes } from "./atributos.js";
import { consumosRoutes } from "./consumos.js";
import { usersRoutes } from "./users.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => ({ status: "ok" }));

  await app.register(usersRoutes, { prefix: "/users" });
  await app.register(consumosRoutes, { prefix: "/consumos" });
  await app.register(atributosRoutes, { prefix: "/atributos" });
};
