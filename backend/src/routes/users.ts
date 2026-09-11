import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import { createUserSchema, updateUserSchema, userIdParam } from "../schemas/index.js";

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  });

  app.get("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, userIdParam, request.params);
    if (!params) {
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: params.id } });

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    return user;
  });

  app.post("/", async (request, reply) => {
    const body = parseWithSchema(reply, createUserSchema, request.body);
    if (!body) {
      return;
    }

    try {
      const user = await prisma.user.create({
        data: { email: body.email, name: body.name },
      });
      return reply.status(201).send(user);
    } catch {
      return reply.status(409).send({ error: "Já existe um usuário com este e-mail" });
    }
  });

  app.put("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, userIdParam, request.params);
    if (!params) {
      return;
    }

    const body = parseWithSchema(reply, updateUserSchema, request.body);
    if (!body) {
      return;
    }

    try {
      return await prisma.user.update({
        where: { id: params.id },
        data: body,
      });
    } catch {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }
  });

  app.delete("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, userIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      await prisma.user.delete({ where: { id: params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }
  });
};
