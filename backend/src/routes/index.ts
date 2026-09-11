import type { FastifyPluginAsync } from "fastify";
import { usersRoutes } from "./users.js";

export const routes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => ({ status: "ok" }));

  await app.register(usersRoutes, { prefix: "/users" });
};
