import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateUserInput, UpdateUserInput } from "../../schemas/user.js";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }
  return user;
}

export async function createUser(input: CreateUserInput) {
  try {
    return await prisma.user.create({
      data: { email: input.email, name: input.name },
    });
  } catch {
    throw new AppError("Já existe um usuário com este e-mail", 409);
  }
}

export async function updateUser(id: number, input: UpdateUserInput) {
  try {
    return await prisma.user.update({
      where: { id },
      data: input,
    });
  } catch {
    throw new AppError("Usuário não encontrado", 404);
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    throw new AppError("Usuário não encontrado", 404);
  }
}
