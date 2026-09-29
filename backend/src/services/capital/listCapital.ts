import { prisma } from "../../lib/prisma.js";
import type { ListCapitalQuery } from "../../schemas/capital.js";

export async function listCapital(query: ListCapitalQuery) {
  const { page, pageSize } = query;
  const busca = query.nome?.trim();

  const where = busca
    ? {
        OR: [
          { name: { contains: busca } },
          { description: { contains: busca } },
        ],
      }
    : {};

    const [rows, total] = await Promise.all([
    prisma.capital.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.capital.count({ where }),
  ]);

  return {
    data: rows.map((capital) => ({
      id: capital.id,
      nome: capital.name,
      assetNum: capital.assetNum,
      descricao: capital.description,
    })),
    page,
    pageSize,
    total,
  };
}