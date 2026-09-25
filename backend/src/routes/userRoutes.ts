import { FastifyInstance } from "fastify";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
    const typedApp = app.withTypeProvider<ZodTypeProvider>();

    // GET /users
    typedApp.get("/users", {
        schema: {
            tags: ["users"],
            description: "List users",
            response: {
                200: z.array(
                    z.object({
                        id_user: z.number(),
                        name: z.string(),
                        email: z.string(),
                    })
                ),
            },
        },
    }, async () => {
        const users = await prisma.user.findMany({
            select: {
                id_user: true,
                name: true,
                email: true,
            },
        });

        return users;
    });

    // POST /users
    typedApp.post("/users", {
        schema: {
            tags: ["users"],
            description: "Create a new user",

            body: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string(),
            }),

            response: {
                201: z.object({
                    id_user: z.number(),
                    name: z.string(),
                    email: z.string(),
                }),

                409: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { name, email, password } = request.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return reply.status(409).send({
                message: "Email already registered",
            });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
            select: {
                id_user: true,
                name: true,
                email: true,
            },
        });

        return reply.status(201).send(user);
    });

    // DELETE /users
    typedApp.delete("/users", {
        schema: {
            tags: ["users"],
            description: "Delete a user by name and email",

            body: z.object({
                name: z.string(),
                email: z.string().email(),
            }),

            response: {
                204: z.null(),

                404: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { name, email } = request.body;

        const user = await prisma.user.findFirst({
            where: {
                name,
                email,
            },
        });

        if (!user) {
            return reply.status(404).send({
                message: "User not found",
            });
        }

        await prisma.user.delete({
            where: {
                id_user: user.id_user,
            },
        });

        return reply.status(204).send(null);
    });
}
