import { readAtributoValor } from "../../lib/atributoValor.js";
import { quantidadeEstoqueOf } from "./atributosHelper.js";

type ConsumoWithRelations = {
  id: number;
  nome: string;
  descricao: string | null;
  variantes: Array<{
    estoque: { quantidade: number } | null;
    atributos: Array<{
      atributoId: number;
      valorTexto: string | null;
      valorInteiro: number | null;
      valorDecimal: { toString(): string } | null;
      valorBooleano: boolean | null;
      atributo: { nome: string; tipoValor: string };
    }>;
  }>;
};

export function mapConsumoDetail(consumo: ConsumoWithRelations) {
  const quantidadeEstoque = quantidadeEstoqueOf(consumo);

  const atributosMap = new Map<
    number,
    {
      nome: string;
      tipoValor: string;
      valor: string | number | boolean | null;
    }
  >();

  for (const variante of consumo.variantes) {
    for (const item of variante.atributos) {
      if (!atributosMap.has(item.atributoId)) {
        atributosMap.set(item.atributoId, {
          nome: item.atributo.nome,
          tipoValor: item.atributo.tipoValor,
          valor: readAtributoValor(item),
        });
      }
    }
  }

  return {
    id: consumo.id,
    nome: consumo.nome,
    descricao: consumo.descricao,
    quantidadeEstoque,
    atributos: [...atributosMap.values()],
  };
}

export const consumoDetailInclude = {
  variantes: {
    include: {
      estoque: true,
      atributos: {
        include: {
          atributo: true,
        },
        orderBy: {
          atributoId: "asc" as const,
        },
      },
    },
    orderBy: {
      id: "asc" as const,
    },
  },
};
