import type { FastifyPluginAsync } from "fastify";
import { AppError, getErrorMessage } from "../lib/errors.js";
import { parseWithSchema } from "../lib/validate.js";
import {
  consumoIdParam,
  createConsumoSchema,
  listConsumoQuery,
  updateConsumoEstoqueSchema,
} from "../schemas/consumo.js";
import { createConsumo } from "../services/consumo/createConsumo.js";
import { deleteConsumo } from "../services/consumo/deleteConsumo.js";
import { getConsumoById } from "../services/consumo/getConsumoById.js";
import { listConsumos } from "../services/consumo/listConsumos.js";
import { updateConsumo } from "../services/consumo/updateConsumo.js";
import { updateConsumoEstoque } from "../services/consumo/updateConsumoEstoque.js";

export const consumosRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const query = parseWithSchema(reply, listConsumoQuery, request.query);
    if (!query) {
      return;
    }

    return listConsumos(query);
  });

  app.get("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, consumoIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      return await getConsumoById(params.id);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao buscar consumo"),
      });
    }
  });

  app.post("/", async (request, reply) => {
    const body = parseWithSchema(reply, createConsumoSchema, request.body);
    if (!body) {
      return;
    }

    try {
      const created = await createConsumo(body);
      return reply.status(201).send(created);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 400;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao criar consumo"),
        ...(error instanceof AppError ? error.details : undefined),
      });
    }
  });

  app.put("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, consumoIdParam, request.params);
    if (!params) {
      return;
    }

    const body = parseWithSchema(reply, createConsumoSchema, request.body);
    if (!body) {
      return;
    }

    try {
      return await updateConsumo(params.id, body);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 400;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao atualizar consumo"),
        ...(error instanceof AppError ? error.details : undefined),
      });
    }
  });

  app.delete("/:id", async (request, reply) => {
    const params = parseWithSchema(reply, consumoIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      await deleteConsumo(params.id);
      return reply.status(204).send();
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 400;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao remover consumo"),
      });
    }
  });

  app.patch("/:id/estoque", async (request, reply) => {
    const params = parseWithSchema(reply, consumoIdParam, request.params);
    if (!params) {
      return;
    }

    const body = parseWithSchema(reply, updateConsumoEstoqueSchema, request.body);
    if (!body) {
      return;
    }

    try {
      return await updateConsumoEstoque(params.id, body.quantidade);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 400;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao atualizar estoque"),
      });
    }
  });
};
