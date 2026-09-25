import { prisma } from "../../lib/prisma.js";
import type { ListConsumoQuery } from "../../schemas/consumo.js";
import { consumoDetailInclude, mapConsumoDetail } from "./mapConsumoDetail.js";

export async function listConsumos(query: ListConsumoQuery) {
  const { page, pageSize } = query;
  const busca = query.nome?.trim();

  const where = busca
    ? {
        OR: [
          { nome: { contains: busca } },
          { descricao: { contains: busca } },
        ],
      }
    : {};

  const [rows, total] = await Promise.all([
    prisma.consumo.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: consumoDetailInclude,
    }),
    prisma.consumo.count({ where }),
  ]);

  return {
    data: rows.map(mapConsumoDetail),
    page,
    pageSize,
    total,
  };
}
