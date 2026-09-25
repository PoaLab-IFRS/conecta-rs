import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

export async function updateConsumoEstoque(consumoId: number, quantidade: number) {
  const consumo = await prisma.consumo.findUnique({
    where: { id: consumoId },
    include: {
      variantes: {
        include: { estoque: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!consumo) {
    throw new AppError("Consumo não encontrado", 404);
  }

  const variante = consumo.variantes[0];

  if (!variante) {
    const created = await prisma.varianteConsumo.create({
      data: {
        consumoId,
        estoque: {
          create: { quantidade },
        },
      },
      include: { estoque: true },
    });

    return {
      consumoId,
      quantidade: created.estoque!.quantidade,
    };
  }

  if (variante.estoque) {
    const estoque = await prisma.estoque.update({
      where: { id: variante.estoque.id },
      data: { quantidade },
    });

    return {
      consumoId,
      quantidade: estoque.quantidade,
    };
  }

  const estoque = await prisma.estoque.create({
    data: {
      varianteConsumoId: variante.id,
      quantidade,
    },
  });

  return {
    consumoId,
    quantidade: estoque.quantidade,
  };
}
