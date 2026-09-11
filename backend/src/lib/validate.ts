import type { FastifyReply } from "fastify";
import { z } from "zod";

export function parseWithSchema<T>(
  reply: FastifyReply,
  schema: z.ZodType<T>,
  value: unknown,
): T | null {
  const result = schema.safeParse(value);
  if (!result.success) {
    reply.status(400).send({
      error: "Falha na validação",
      details: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return null;
  }

  return result.data;
}
