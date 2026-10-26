
import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput } from "../../schemas/user.js";
import { AppError } from "../../lib/errors.js";

export async function createUser(input: CreateUserInput) {
  // Verifica se o e-mail já está cadastrado
  const emailExists = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (emailExists) {
    throw new AppError(
      "Já existe um usuário cadastrado com esse e-mail",
      409,
    );
  }

  let user;

  try {
    // Gera o hash da senha usando Argon2id
    const senhaHash = await argon2.hash(input.senha, {
      type: argon2.argon2id,
    });

    user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        senha: senhaHash,
        tipoUser: input.tipoUser,
      },
    });
  } catch (error) {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        throw new AppError(
        "Já existe um usuário cadastrado com esse e-mail",
        409,
        );
    }

    throw error;
    }

  // Retorna os dados públicos, sem a senha
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    tipoUser: user.tipoUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
