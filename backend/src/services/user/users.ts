import { fromNodeHeaders } from "better-auth/node";
import type { FastifyRequest } from "fastify";
import { AppError } from "../../lib/errors.js";
import { auth } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "../../schemas/user.js";

function getBetterAuthRole(tipoUser: CreateUserInput["tipoUser"]) {
  return tipoUser === "ADMIN" ? "admin" : "user";
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
}

export async function createUser(
  input: CreateUserInput,
  request: FastifyRequest,
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError("Já existe um usuário com este e-mail", 409);
  }

  try {
    const result = await auth.api.createUser({
      headers: fromNodeHeaders(request.headers),

      body: {
        email: input.email,
        name: input.name,
        password: input.password,
        role: getBetterAuthRole(input.tipoUser),

        data: {
          tipoUser: input.tipoUser,
        },
      },
    });

    if (!result) {
      throw new AppError("Não foi possível criar o usuário", 500);
    }

    return result.user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error(error);
    throw new AppError("Falha ao criar o usuário pelo Better Auth", 500);
  }
}

export async function updateUser(id: string, input: UpdateUserInput) {
  try {
    const data: {
      email?: string;
      name?: string;
      tipoUser?: UpdateUserInput["tipoUser"];
      role?: string;
    } = {};

    if (input.email !== undefined) {
      data.email = input.email;
    }

    if (input.name !== undefined) {
      data.name = input.name;
    }

    if (input.tipoUser !== undefined) {
      data.tipoUser = input.tipoUser;
      data.role = getBetterAuthRole(input.tipoUser);
    }

    return await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  } catch {
    throw new AppError("Usuário não encontrado", 404);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch {
    throw new AppError("Usuário não encontrado", 404);
  }
}