import { Prisma } from "@prisma/client";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateCapitalInput } from "../../schemas/capital.js";

export async function updateCapital(id: number, input: CreateCapitalInput) {
    const existing = await prisma.capital.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new AppError("Capital não encontrada", 404);
    }

    const [assetNumExists, serialExists] = await Promise.all([
        prisma.capital.findFirst({
            where: { assetNum: input.assetNum, NOT: { id } },
        }),
        prisma.capital.findFirst({
            where: { serialNumber: input.numeroSerie, NOT: { id } },
        }),
    ]);

    if (assetNumExists) {
        throw new AppError("Já existe um capital com o mesmo número patrimonial", 409);
    }

    if (serialExists) {
        throw new AppError("Já existe um capital com o mesmo número de série", 409);
    }

    let updated;
    try {
        updated = await prisma.capital.update({
            where: { id },
            data: {
                name: input.nome,
                assetNum: input.assetNum,
                description: input.descricao?.trim() || null,
                invoiceNumber: input.notaFiscal,
                value: input.valor,
                schoolName: input.nomeEscola,
                serialNumber: input.numeroSerie,
            }
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
        id: updated.id,
        nome: updated.name,
        assetNum: updated.assetNum,
        descricao: updated.description,
        notaFiscal: updated.invoiceNumber,
        valor: updated.value.toString(),
        nomeEscola: updated.schoolName,
        numeroSerie: updated.serialNumber,
    };
}