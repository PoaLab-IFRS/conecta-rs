import type { FastifyPluginAsync } from "fastify";
import { AppError, getErrorMessage } from "../lib/errors.js";
import { parseWithSchema } from "../lib/validate.js";
import { createUserSchema, updateUserSchema, userIdParam } from "../schemas/user.js";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "../services/user/users.js";

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => listUsers());

  app.get("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, userIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      return await getUserById(params.id);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao buscar usuário"),
      });
    }
  });

  app.post("/", async (request, reply) => {
    const body = parseWithSchema(reply, createUserSchema, request.body);
    if (!body) {
      return;
    }

    try {
      const user = await createUser(body);
      return reply.status(201).send(user);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao criar usuário"),
      });
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
      return await updateUser(params.id, body);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao atualizar usuário"),
      });
    }
  });

  app.delete("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, userIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      await deleteUser(params.id);
      return reply.status(204).send();
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao remover usuário"),
      });
    }
  });
};
