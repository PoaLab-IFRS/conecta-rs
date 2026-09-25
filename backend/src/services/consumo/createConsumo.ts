import { readAtributoValor } from "../../lib/atributoValor.js";
import { writeAtributoValor } from "../../lib/atributoValor.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateConsumoInput } from "../../schemas/consumo.js";
import {
  assertNoConflitoAtributos,
  findConflitoAtributos,
  resolveAtributos,
} from "./atributosHelper.js";

export async function createConsumo(input: CreateConsumoInput) {
  return prisma.$transaction(async (tx) => {
    const resolvedAtributos = await resolveAtributos(tx, input.atributos);

    if (resolvedAtributos.length > 0) {
      const conflito = await findConflitoAtributos(tx, resolvedAtributos);
      assertNoConflitoAtributos(conflito, input.forceCreate);
    }

    const consumo = await tx.consumo.create({
      data: {
        nome: input.nome,
        descricao: input.descricao?.trim() ? input.descricao.trim() : null,
      },
    });

    if (resolvedAtributos.length > 0) {
      await tx.consumoAtributo.createMany({
        data: resolvedAtributos.map((item) => ({
          consumoId: consumo.id,
          atributoId: item.atributoId,
        })),
      });
    }

    const variante = await tx.varianteConsumo.create({
      data: { consumoId: consumo.id },
    });

    for (const item of resolvedAtributos) {
      await tx.varianteAtributo.create({
        data: {
          varianteConsumoId: variante.id,
          atributoId: item.atributoId,
          ...writeAtributoValor(item.tipoValor, item.valor),
        },
      });
    }

    await tx.estoque.create({
      data: {
        varianteConsumoId: variante.id,
        quantidade: input.quantidade,
      },
    });

    return {
      id: consumo.id,
      nome: consumo.nome,
      descricao: consumo.descricao,
    };
  });
}
