import { writeAtributoValor } from "../../lib/atributoValor.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateConsumoInput } from "../../schemas/consumo.js";
import {
  assertNoConflitoAtributos,
  findConflitoAtributos,
  resolveAtributos,
} from "./atributosHelper.js";

export async function updateConsumo(id: number, input: CreateConsumoInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.consumo.findUnique({
      where: { id },
      include: {
        variantes: {
          include: { estoque: true },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!existing) {
      throw new AppError("Consumo não encontrado", 404);
    }

    const resolvedAtributos = await resolveAtributos(tx, input.atributos);

    if (resolvedAtributos.length > 0) {
      const conflito = await findConflitoAtributos(tx, resolvedAtributos, {
        excludeConsumoId: id,
      });
      assertNoConflitoAtributos(conflito, input.forceCreate);
    }

    const consumo = await tx.consumo.update({
      where: { id },
      data: {
        nome: input.nome,
        descricao: input.descricao?.trim() ? input.descricao.trim() : null,
      },
    });

    await tx.consumoAtributo.deleteMany({ where: { consumoId: id } });

    if (resolvedAtributos.length > 0) {
      await tx.consumoAtributo.createMany({
        data: resolvedAtributos.map((item) => ({
          consumoId: id,
          atributoId: item.atributoId,
        })),
      });
    }

    let variante = existing.variantes[0];
    if (!variante) {
      variante = await tx.varianteConsumo.create({
        data: { consumoId: id },
        include: { estoque: true },
      });
    }

    await tx.varianteAtributo.deleteMany({ where: { varianteConsumoId: variante.id } });

    for (const item of resolvedAtributos) {
      await tx.varianteAtributo.create({
        data: {
          varianteConsumoId: variante.id,
          atributoId: item.atributoId,
          ...writeAtributoValor(item.tipoValor, item.valor),
        },
      });
    }

    if (variante.estoque) {
      await tx.estoque.update({
        where: { id: variante.estoque.id },
        data: { quantidade: input.quantidade },
      });
    } else {
      await tx.estoque.create({
        data: {
          varianteConsumoId: variante.id,
          quantidade: input.quantidade,
        },
      });
    }

    return {
      id: consumo.id,
      nome: consumo.nome,
      descricao: consumo.descricao,
    };
  });
}
