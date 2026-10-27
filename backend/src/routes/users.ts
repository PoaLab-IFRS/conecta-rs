
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { AppError, getErrorMessage } from '../lib/errors.js';

import {
    userErrorResponseSchema,
    userResponseSchema,
    listUserResponseSchema,
    deleteUserResponseSchema,
    userIdParam,
    createUserSchema,
    updateUserSchema,
    listUserQuery,
} from '../schemas/user.js';

import { createUser } from '../services/user/createUser.js';
import { deleteUser } from '../services/user/deleteUser.js';
import { getUserById } from '../services/user/getUserById.js';
import { listUser } from '../services/user/listUser.js';
import { updateUser } from '../services/user/updateUser.js';

export const userRoutes: FastifyPluginAsyncZod = async (app) => {

    // Lista usuários
    app.get('/', {
        schema: {
            tags: ['User'],
            summary: 'Lista usuários',
            querystring: listUserQuery,
            response: {
                200: listUserResponseSchema,
                400: userErrorResponseSchema,
                500: userErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            return await listUser(request.query);
        } catch (error) {
            const statusCode =
                error instanceof AppError && error.statusCode === 400
                ? 400
                : 500;

            return reply.status(statusCode).send({
                error: getErrorMessage(error, "Falha ao listar usuários"),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });

    // Busca usuário por ID
    app.get('/:id', {
        schema: {
            tags: ['User'],
            summary: 'Busca usuário por ID',
            params: userIdParam,
            response: {
                200: userResponseSchema,
                400: userErrorResponseSchema,
                404: userErrorResponseSchema,
                500: userErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            return await getUserById(request.params.id);
        } catch (error) {
            const statusCode =
                error instanceof AppError && error.statusCode === 404
                    ? 404
                    : 500;

            return reply.status(statusCode).send({
                error: getErrorMessage(error, 'Falha ao buscar usuário'),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });

    // Cria usuário
    app.post('/', {
        schema: {
            tags: ['User'],
            summary: 'Cria usuário',
            body: createUserSchema,
            response: {
                201: userResponseSchema,
                400: userErrorResponseSchema,
                409: userErrorResponseSchema,
                500: userErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const user = await createUser(request.body);
            return reply.code(201).send(user);
        } catch (error) {
            const statusCode =
                error instanceof AppError &&
                (error.statusCode === 400 || error.statusCode === 409)
                    ? error.statusCode
                    : 500;

            return reply.status(statusCode).send({
                error: getErrorMessage(error, 'Falha ao criar usuário'),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });

    // Atualiza usuário
    app.put('/:id', {
        schema: {
            tags: ['User'],
            summary: 'Atualiza usuário',
            params: userIdParam,
            body: updateUserSchema,
            response: {
                200: userResponseSchema,
                400: userErrorResponseSchema,
                404: userErrorResponseSchema,
                409: userErrorResponseSchema,
                500: userErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const user = await updateUser(
                request.params.id,
                request.body
            );

            return reply.code(200).send(user);
        } catch (error) {
            const statusCode =
                error instanceof AppError &&
                [400, 404, 409].includes(error.statusCode)
                ? (error.statusCode as 400 | 404 | 409)
                : 500;

            return reply.status(statusCode).send({
                error: getErrorMessage(error, "Falha ao atualizar usuário"),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });

    // Exclui usuário
    app.delete('/:id', {
        schema: {
            tags: ['User'],
            summary: 'Exclui usuário',
            params: userIdParam,
            response: {
                204: deleteUserResponseSchema,
                400: userErrorResponseSchema,
                404: userErrorResponseSchema,
                500: userErrorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            await deleteUser(request.params.id);
            return reply.code(204).send();
        } catch (error) {
            const statusCode =
                error instanceof AppError && error.statusCode === 404
                    ? 404
                    : 500;

            return reply.status(statusCode).send({
                error: getErrorMessage(error, 'Falha ao excluir usuário'),
                ...(error instanceof AppError ? error.details : undefined),
            });
        }
    });
};


// import type { FastifyPluginAsync } from "fastify";
// import { AppError, getErrorMessage } from "../lib/errors.js";
// import { parseWithSchema } from "../lib/validate.js";
// import { createUserSchema, updateUserSchema, userIdParam } from "../schemas/user.js";
// import {
//   createUser,
//   deleteUser,
//   getUserById,
//   listUsers,
//   updateUser,
// } from "../services/user/users.js";

// export const usersRoutes: FastifyPluginAsync = async (app) => {
//   app.get("/", async () => listUsers());

//   app.get("/:id", async (request, reply) => {
//     const params = parseWithSchema(reply, userIdParam, request.params);
//     if (!params) {
//       return;
//     }

//     try {
//       return await getUserById(params.id);
//     } catch (error) {
//       const statusCode = error instanceof AppError ? error.statusCode : 500;
//       return reply.status(statusCode).send({
//         error: getErrorMessage(error, "Falha ao buscar usuário"),
//       });
//     }
//   });

//   app.post("/", async (request, reply) => {
//     const body = parseWithSchema(reply, createUserSchema, request.body);
//     if (!body) {
//       return;
//     }

//     try {
//       const user = await createUser(body);
//       return reply.status(201).send(user);
//     } catch (error) {
//       const statusCode = error instanceof AppError ? error.statusCode : 500;
//       return reply.status(statusCode).send({
//         error: getErrorMessage(error, "Falha ao criar usuário"),
//       });
//     }
//   });

//   app.put("/:id", async (request, reply) => {
//     const params = parseWithSchema(reply, userIdParam, request.params);
//     if (!params) {
//       return;
//     }

//     const body = parseWithSchema(reply, updateUserSchema, request.body);
//     if (!body) {
//       return;
//     }

//     try {
//       return await updateUser(params.id, body);
//     } catch (error) {
//       const statusCode = error instanceof AppError ? error.statusCode : 500;
//       return reply.status(statusCode).send({
//         error: getErrorMessage(error, "Falha ao atualizar usuário"),
//       });
//     }
//   });

//   app.delete("/:id", async (request, reply) => {
//     const params = parseWithSchema(reply, userIdParam, request.params);
//     if (!params) {
//       return;
//     }

//     try {
//       await deleteUser(params.id);
//       return reply.status(204).send();
//     } catch (error) {
//       const statusCode = error instanceof AppError ? error.statusCode : 500;
//       return reply.status(statusCode).send({
//         error: getErrorMessage(error, "Falha ao remover usuário"),
//       });
//     }
//   });
// };
