import { prisma } from "../../lib/prisma.js";
import type { ListAtributoQuery } from "../../schemas/atributo.js";

export async function listAtributos(query: ListAtributoQuery) {
  const nome = query.nome?.trim();

  return prisma.atributo.findMany({
    where: nome
      ? {
          nome: {
            contains: nome,
          },
        }
      : undefined,
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      tipoValor: true,
    },
  });
}
