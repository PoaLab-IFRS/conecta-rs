import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

export async function deleteCapital(id: number) {
    const result = await prisma.capital.deleteMany({
        where: { id },
    });

    if (result.count === 0) {
        throw new AppError("Item Capital não encontrada", 404);
    }
}