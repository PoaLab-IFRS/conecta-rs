import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";

export async function deleteUser(id: number) {
    const result = await prisma.user.deleteMany({
        where: { id },
    });

    if (result.count === 0) {
        throw new AppError("Usuário não encontrado", 404);
    }
}