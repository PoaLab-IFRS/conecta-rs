import type { FastifyReply, FastifyRequest } from "fastify";

type RoleHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void | FastifyReply>;

export function requireRole(...allowedRoles: string[]): RoleHandler {
  return async (request, reply) => {
    const session = request.authSession;

    if (!session) {
      return reply.status(401).send({
        error: "Autenticação necessária",
      });
    }

    const role = session.user.role;

    if (!role || !allowedRoles.includes(role)) {
      return reply.status(403).send({
        error: "Você não tem permissão para realizar esta ação",
      });
    }
  };
}