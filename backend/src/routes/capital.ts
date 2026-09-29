import type { FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import { AppError, getErrorMessage } from '../lib/errors.js';
import { 
    capitalErrorResponseSchema,
    capitalResponseSchema,
    listCapitalResponseSchema,
    deleteCapitalResponseSchema,
    capitalIdParam, 
    createCapitalSchema, 
    listCapitalQuery 
} from '../schemas/capital.js';
import { createCapital } from  "../services/capital/createCapital.js";
import { deleteCapital } from  "../services/capital/deleteCapital.js";
import { getCapitalById } from  "../services/capital/getCapitalById.js";
import { listCapital } from  "../services/capital/listCapital.js";
import { updateCapital } from  "../services/capital/updateCapital.js";

export const capitalRoutes: FastifyPluginAsyncZod = async (app) => {
    app.get('/', {
        schema: {
            tags: ['Capital'],
            summary: 'Lista capitais',
            querystring: listCapitalQuery,
            response: {
                200: listCapitalResponseSchema,
                400: capitalErrorResponseSchema,
                500: capitalErrorResponseSchema,
            },
        },
    }, async (request) => listCapital(request.query),
);

    app.get('/:id', {
        schema: {
            tags: ['Capital'],
            summary: 'Busca capital por ID',
            params: capitalIdParam,
            response: {
                200: capitalResponseSchema,
                400: capitalErrorResponseSchema,
                404: capitalErrorResponseSchema,
                500: capitalErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            return await getCapitalById(request.params.id);
        } catch (error) {
            const statusCode =
                error instanceof AppError && error.statusCode === 404 ? 404 : 500;
            return reply.status(statusCode).send({
                error: getErrorMessage(error, "Falha ao buscar capital"),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });

    app.post('/',
        {
            schema: {
                tags: ['Capital'],
                summary: 'Cria capital',
                body: createCapitalSchema,
                response: {
                    201: capitalResponseSchema,
                    400: capitalErrorResponseSchema,
                    500: capitalErrorResponseSchema,
                }
            },
        }, async (request, reply) => {
            try {
                const capital = await createCapital(request.body);
                return reply.code(201).send(capital);
            } catch (error) {
                const statusCode =
                    error instanceof AppError && error.statusCode === 400 ? 400 : 500;
                return reply.status(statusCode).send({
                    error: getErrorMessage(error, "Falha ao criar capital"),
                    ...(error instanceof AppError ? error.details : undefined),
                });
            }
        }
    );

    app.put('/:id',
        {
            schema: {
                tags: ['Capital'],
                summary: 'Atualiza capital',
                body: createCapitalSchema,
                params: capitalIdParam,
                response: {
                    200: capitalResponseSchema,
                    400: capitalErrorResponseSchema,
                    404: capitalErrorResponseSchema,
                    500: capitalErrorResponseSchema,
                }
            },
        }, async (request, reply) => {
            try {
                return await updateCapital(request.params.id, request.body);
            } catch (error) {
                const statusCode =
                    error instanceof AppError && error.statusCode === 404 ? 404 : 500;
                return reply.status(statusCode).send({
                    error: getErrorMessage(error, "Falha ao atualizar capital"),
                    ...(error instanceof AppError ? error.details : undefined),
                });
            }
        }
    );

    app.delete('/:id',
        {
            schema: {
                tags: ['Capital'],
                summary: 'Deleta capital',
                params: capitalIdParam,
                response: {
                    204: deleteCapitalResponseSchema,
                    400: capitalErrorResponseSchema,
                    404: capitalErrorResponseSchema,
                    500: capitalErrorResponseSchema,
                }
            },
        }, async (request, reply) => {
            try {
                await deleteCapital(request.params.id);
                return reply.code(204).send();
            } catch (error) {
                const statusCode =
                    error instanceof AppError && error.statusCode === 404 ? 404 : 500;
                return reply.status(statusCode).send({
                    error: getErrorMessage(error, "Falha ao excluir capital"),
                    ...(error instanceof AppError ? error.details : undefined),
                });
            }
        }
    );
}