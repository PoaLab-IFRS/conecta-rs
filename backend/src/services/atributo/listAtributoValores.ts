import { AppError } from "../../lib/errors.js";
import { readAtributoValor } from "../../lib/atributoValor.js";
import { prisma } from "../../lib/prisma.js";

export async function listAtributoValores(atributoId: number) {
  const atributo = await prisma.atributo.findUnique({
    where: { id: atributoId },
    select: { id: true, tipoValor: true },
  });

  if (!atributo) {
    throw new AppError("Atributo não encontrado", 404);
  }

  const rows = await prisma.varianteAtributo.findMany({
    where: { atributoId },
    include: {
      atributo: {
        select: { tipoValor: true },
      },
    },
  });

  const valores = new Set<string>();

  for (const row of rows) {
    const valor = readAtributoValor(row);
    if (valor === null || valor === undefined) {
      continue;
    }
    if (typeof valor === "boolean") {
      valores.add(valor ? "true" : "false");
    } else {
      valores.add(String(valor));
    }
  }

  return [...valores].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
