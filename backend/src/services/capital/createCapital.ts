import { prisma } from "../../lib/prisma.js";
import type { CreateCapitalInput } from "../../schemas/capital.js";

export async function createCapital(input: CreateCapitalInput) {
  const capital = await prisma.capital.create({
    data: {
      name: input.nome,
      assetNum: input.assetNum,
      description: input.descricao?.trim() || null,
    },
  });

  return {
    id: capital.id,
    nome: capital.name,
    assetNum: capital.assetNum,
    descricao: capital.description,
  };
}