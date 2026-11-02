import type { FastifyPluginAsync } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

const authBaseUrl = process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:3000";

export const authRoutes: FastifyPluginAsync = async (app) => {
    app.route({
        method: ["GET", "POST"],
        url: "/*",
        async handler(request, reply) {
            const url = new URL(request.url, authBaseUrl);
            const headers = fromNodeHeaders(request.headers);
            const hasBody =
                request.method === "POST" &&
                request.body !== undefined;
            if(hasBody){
                headers.delete("content-length");
                headers.delete("transfer-encoding");
            }

            const authRequest = new Request(url, {
                method: request.method,
                headers,
                ...(hasBody 
                    ? { body: JSON.stringify(request.body) }
                    : {}),
            });

            const response = await auth.handler(authRequest);
            response.headers.forEach((value, key) => {
                if(key.toLowerCase() === "set-cookie") {
                    reply.header(key, value);
                }
            });

            const location = response.headers.get("location");
            if(location) {
                reply.header("location", location);
            }

            const cookies = response.headers.getSetCookie();
            if(cookies.length > 0) {
                reply.header("set-cookie", cookies);
            }
            
            const body = await response.text();
            return reply.status(response.status).send(body || null);
    },});
};