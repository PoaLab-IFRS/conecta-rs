import { FastifyInstance } from "fastify";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function capitalRoutes(app: FastifyInstance) {
    const typedApp = app.withTypeProvider<ZodTypeProvider>();

    // GET /capitals
    typedApp.get("/capitals", {
        schema: {
            tags: ["capitals"],
            description: "List capitals",

            response: {
                200: z.array(
                    z.object({
                        id_capital: z.number(),
                        name: z.string(),
                        asset_num: z.string(),
                        description: z.string().nullable(),
                    })
                ),
            },
        },
    }, async () => {
        const capitals = await prisma.capital.findMany();

        return capitals;
    });

    // POST /capitals
    typedApp.post("/capitals", {
        schema: {
            tags: ["capitals"],
            description: "Create a new capital",

            body: z.object({
                name: z.string(),
                asset_num: z.string(),
                description: z.string().optional(),
            }),

            response: {
                201: z.object({
                    id_capital: z.number(),
                    name: z.string(),
                    asset_num: z.string(),
                    description: z.string().nullable(),
                }),

                409: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const {
            name,
            asset_num,
            description,
        } = request.body;

        const capital = await prisma.capital.create({
            data: {
                name,
                asset_num,
                description,
            },
        });

        return reply.status(201).send(capital);
    });

    // DELETE /capitals
    typedApp.delete("/capitals", {
        schema: {
            tags: ["capitals"],
            description: "Delete a capital by name and asset number",

            body: z.object({
                name: z.string(),
                asset_num: z.string(),
            }),

            response: {
                204: z.null(),

                404: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { name, asset_num } = request.body;

        const capital = await prisma.capital.findFirst({
            where: {
                name,
                asset_num,
            },
        });

        if (!capital) {
            return reply.status(404).send({
                message: "Capital not found",
            });
        }

        await prisma.capital.delete({
            where: {
                id_capital: capital.id_capital,
            },
        });

        return reply.status(204).send(null);
    });
}
