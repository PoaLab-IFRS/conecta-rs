import type { FastifyPluginAsync } from "fastify";
import { AppError, getErrorMessage } from "../lib/errors.js";
import { parseWithSchema } from "../lib/validate.js";
import { atributoIdParam, listAtributoQuery } from "../schemas/atributo.js";
import { listAtributos } from "../services/atributo/listAtributos.js";
import { listAtributoValores } from "../services/atributo/listAtributoValores.js";

export const atributosRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const query = parseWithSchema(reply, listAtributoQuery, request.query);
    if (!query) {
      return;
    }

    return listAtributos(query);
  });

  app.get("/:id/valores", async (request, reply) => {
    const params = parseWithSchema(reply, atributoIdParam, request.params);
    if (!params) {
      return;
    }

    try {
      return await listAtributoValores(params.id);
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return reply.status(statusCode).send({
        error: getErrorMessage(error, "Falha ao listar valores do atributo"),
      });
    }
  });
};
