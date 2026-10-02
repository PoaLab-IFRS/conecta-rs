import type { FastifyReply } from "fastify";

export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
export function handleInternalServerError(error: unknown, reply: FastifyReply) {
  console.error(error);
  return reply.status(500).send({ error: "Erro interno do servidor" });
}
