import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { consumoDetailInclude, mapConsumoDetail } from "./mapConsumoDetail.js";

export async function getConsumoById(id: number) {
  const consumo = await prisma.consumo.findUnique({
    where: { id },
    include: consumoDetailInclude,
  });

  if (!consumo) {
    throw new AppError("Consumo não encontrado", 404);
  }

  return mapConsumoDetail(consumo);
}
