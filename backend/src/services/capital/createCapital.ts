import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { CreateCapitalInput } from "../../schemas/capital.js";
import { AppError } from "../../lib/errors.js";

export async function createCapital(input: CreateCapitalInput) {
  const [invoiceExists, assetNumExists, serialExists] = await Promise.all([
    prisma.capital.findFirst({
      where: { invoiceNumber: input.notaFiscal },
    }),
    prisma.capital.findFirst({
      where: { assetNum: input.assetNum },
    }),
    prisma.capital.findFirst({
      where: { serialNumber: input.numeroSerie },
    }),
  ]);

  if (invoiceExists) {
    throw new AppError("Já existe um capital com a mesma nota fiscal", 409);
  }

  if (assetNumExists) {
    throw new AppError("Já existe um capital com o mesmo número patrimonial", 409);
  }

  if (serialExists) {
    throw new AppError("Já existe um capital com o mesmo número de série", 409);
  }

  let capital;
  try {
    capital = await prisma.capital.create({
      data: {
        name: input.nome,
        assetNum: input.assetNum,
        description: input.descricao?.trim() || null,
        invoiceNumber: input.notaFiscal,
        value: input.valor,
        schoolName: input.nomeEscola,
        serialNumber: input.numeroSerie,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Número patrimonial ou número de série já cadastrado",
        409,
      );
    }
    throw error;
  }

  return {
    id: capital.id,
    nome: capital.name,
    assetNum: capital.assetNum,
    descricao: capital.description,
    notaFiscal: capital.invoiceNumber,
    valor: capital.value.toString(),
    nomeEscola: capital.schoolName,
    numeroSerie: capital.serialNumber,
  };
}