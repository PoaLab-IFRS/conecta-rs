import { fromNodeHeaders } from "better-auth/node";
import type { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/auth.js";

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

declare module "fastify" {
  interface FastifyRequest {
    authSession: AuthSession | null;
  }
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
){
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
        return reply.status(401).send({
            error: "Autenticação necessária",
        });
    }

    request.authSession = session;
}