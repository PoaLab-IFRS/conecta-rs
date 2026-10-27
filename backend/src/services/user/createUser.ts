import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput } from "../../schemas/user.js";

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
      select: {
        id: true,
        email: true,
        name: true,
        tipoUser: true,
        createdAt: true,
        updatedAt: true,
      },
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