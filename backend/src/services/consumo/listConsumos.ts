import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { ListConsumoQuery } from "../../schemas/consumo.js";
import { consumoDetailInclude, mapConsumoDetail } from "./mapConsumoDetail.js";

function buildAtributoValorFilters(busca: string): Prisma.VarianteAtributoWhereInput[] {
  const filters: Prisma.VarianteAtributoWhereInput[] = [
    { valorTexto: { contains: busca } },
  ];

  const asNumber = Number(busca);
  if (busca !== "" && !Number.isNaN(asNumber)) {
    if (Number.isInteger(asNumber)) {
      filters.push({ valorInteiro: asNumber });
    }
    filters.push({ valorDecimal: asNumber });
  }

  const normalized = busca.toLowerCase();
  if (normalized === "true" || normalized === "sim" || normalized === "1") {
    filters.push({ valorBooleano: true });
  } else if (normalized === "false" || normalized === "nao" || normalized === "não" || normalized === "0") {
    filters.push({ valorBooleano: false });
  }

  return filters;
}

function buildConsumoSearchWhere(busca: string): Prisma.ConsumoWhereInput {
  const atributoValorFilters = buildAtributoValorFilters(busca);

  return {
    OR: [
      { nome: { contains: busca } },
      { descricao: { contains: busca } },
      {
        variantes: {
          some: {
            atributos: {
              some: {
                OR: [{ atributo: { nome: { contains: busca } } }, ...atributoValorFilters],
              },
            },
          },
        },
      },
    ],
  };
}

export async function listConsumos(query: ListConsumoQuery) {
  const { page, pageSize } = query;
  const busca = query.nome?.trim();

  const where = busca ? buildConsumoSearchWhere(busca) : {};

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
