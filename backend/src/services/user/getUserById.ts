import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma";

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tipoUser: user.tipoUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}