import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { AppError, getErrorMessage } from "../lib/errors.js";
import { parseWithSchema } from "../lib/validate.js";
import { requireAuth } from "../plugins/requireAuth.js";
import { requireRole } from "../plugins/requireRole.js";
import { listInventoryByUser } from "../services/user/inventoryByUser.js";

const userIdParam = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "O ID do usuário é obrigatório")
    .max(191, "ID de usuário inválido"),
});

export const adminInventoryRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/users/:userId",
    {
      preHandler: [requireAuth, requireRole("admin")],
    },
    async (request, reply) => {
      const params = parseWithSchema(reply, userIdParam, request.params);

      if (!params) {
        return;
      }

      try {
        return await listInventoryByUser(params.userId);
      } catch (error) {
        const statusCode = error instanceof AppError ? error.statusCode : 500;

        return reply.status(statusCode).send({
          error: getErrorMessage(error, "Falha ao consultar estoque do usuário"),
        });
      }
    },
  );
};