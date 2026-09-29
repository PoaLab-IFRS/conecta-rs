import { AppError} from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateCapitalInput } from "../../schemas/capital.js";

export async function updateCapital(id: number, input: CreateCapitalInput) {
    const existing = await prisma.capital.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new AppError("Capital não encontrada", 404);
    }

    const updated = await prisma.capital.update({
        where: { id },
        data: {
            name: input.nome,
            assetNum: input.assetNum,
            description: input.descricao?.trim() || null,
        }
    });

    return {
        id: updated.id,
        nome: updated.name,
        assetNum: updated.assetNum,
        descricao: updated.description,
    };
}