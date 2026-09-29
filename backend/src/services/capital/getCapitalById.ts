import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma";

export async function getCapitalById(id: number) {
  const capital = await prisma.capital.findUnique({
    where: { id },
  });

  if (!capital) {
    throw new AppError("Item Capital não encontrada", 404);
  }

  return {
    id: capital.id,
    nome: capital.name,
    assetNum: capital.assetNum,
    descricao: capital.description,
  };
}