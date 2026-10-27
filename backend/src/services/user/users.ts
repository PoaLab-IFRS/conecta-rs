
import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "../../schemas/user.js";

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  tipoUser: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: publicUserSelect,
  });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
}

export async function createUser(input: CreateUserInput) {
  try {
    const senhaHash = await argon2.hash(input.senha, {
      type: argon2.argon2id,
    });

    return await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        senha: senhaHash,
        tipoUser: input.tipoUser,
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe um usuário com este e-mail",
        409,
      );
    }

    throw error;
  }
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
) {
  const data: Prisma.UserUpdateInput = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.email !== undefined) {
    data.email = input.email;
  }

  if (input.tipoUser !== undefined) {
    data.tipoUser = input.tipoUser;
  }

  if (input.senha !== undefined && input.senha.length > 0) {
    data.senha = await argon2.hash(input.senha, {
      type: argon2.argon2id,
    });
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2025") {
        throw new AppError("Usuário não encontrado", 404);
      }

      if (error.code === "P2002") {
        throw new AppError(
          "Já existe um usuário com este e-mail",
          409,
        );
      }
    }

    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError("Usuário não encontrado", 404);
    }

    throw error;
  }
}
