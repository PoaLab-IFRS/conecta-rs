import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

export async function deleteConsumo(id: number) {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.consumo.findUnique({
      where: { id },
      include: {
        variantes: { select: { id: true } },
      },
    });

    if (!existing) {
      throw new AppError("Consumo não encontrado", 404);
    }

    const varianteIds = existing.variantes.map((item) => item.id);

    if (varianteIds.length > 0) {
      await tx.varianteAtributo.deleteMany({
        where: { varianteConsumoId: { in: varianteIds } },
      });
      await tx.estoque.deleteMany({
        where: { varianteConsumoId: { in: varianteIds } },
      });
      await tx.varianteConsumo.deleteMany({
        where: { id: { in: varianteIds } },
      });
    }

    await tx.consumoAtributo.deleteMany({ where: { consumoId: id } });
    await tx.consumo.delete({ where: { id } });
  });
}
