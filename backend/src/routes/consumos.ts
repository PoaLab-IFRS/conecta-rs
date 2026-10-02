import type { FastifyError, FastifyPluginAsync } from "fastify";
import { AppError, getErrorMessage, handleInternalServerError } from "../lib/errors.js";
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
  const inheritedErrorHandler = app.errorHandler;
  app.setErrorHandler<FastifyError>(function (error, request, reply) {
    // Preserve Fastify input errors (e.g. malformed JSON and unsupported media).
    if (
      error.code?.startsWith("FST_ERR_") &&
      error.statusCode !== undefined &&
      error.statusCode >= 400 &&
      error.statusCode < 500
    ) {
      return inheritedErrorHandler.call(this, error, request, reply);
    }
    return handleInternalServerError(error, reply);
  });

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
      if (!(error instanceof AppError)) {
        throw error;
      }
      return reply.status(error.statusCode).send({
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
      if (!(error instanceof AppError)) {
        throw error;
      }
      return reply.status(error.statusCode).send({
        error: getErrorMessage(error, "Falha ao criar consumo"),
        ...error.details,
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
      if (!(error instanceof AppError)) {
        throw error;
      }
      return reply.status(error.statusCode).send({
        error: getErrorMessage(error, "Falha ao atualizar consumo"),
        ...error.details,
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
      if (!(error instanceof AppError)) {
        throw error;
      }
      return reply.status(error.statusCode).send({
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
      if (!(error instanceof AppError)) {
        throw error;
      }
      return reply.status(error.statusCode).send({
        error: getErrorMessage(error, "Falha ao atualizar estoque"),
      });
    }
  });
};
