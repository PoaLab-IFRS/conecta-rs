import { prisma } from "../../lib/prisma.js";

export async function listInventoryByUser(userId: string) {
  const stockItems = await prisma.estoque.findMany({
    //where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      varianteConsumo: {
        include: {
          consumo: {
            select: {
              id: true,
              nome: true,
              descricao: true,
            },
          },
          atributos: {
            orderBy: { atributoId: "asc" },
            include: {
              atributo: {
                select: {
                  id: true,
                  nome: true,
                  tipoValor: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return stockItems.map((item) => ({
    id: item.id,
    varianteConsumoId: item.varianteConsumoId,
    quantidade: item.quantidade,
    atualizadoEm: item.updatedAt,
    consumo: item.varianteConsumo.consumo,
    atributos: item.varianteConsumo.atributos.map((itemAtributo) => ({
      id: itemAtributo.atributo.id,
      nome: itemAtributo.atributo.nome,
      tipoValor: itemAtributo.atributo.tipoValor,
      valor:
        itemAtributo.valorTexto ??
        itemAtributo.valorInteiro ??
        itemAtributo.valorDecimal?.toString() ??
        itemAtributo.valorBooleano ??
        null,
    })),
  }));
}