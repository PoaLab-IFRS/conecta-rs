import type { TipoValor } from "@prisma/client";

type ValorColumns = {
  valorTexto: string | null;
  valorInteiro: number | null;
  valorDecimal: { toString(): string } | null;
  valorBooleano: boolean | null;
};

export function readAtributoValor(
  item: ValorColumns & { atributo: { tipoValor: string } },
): string | number | boolean | null {
  switch (item.atributo.tipoValor) {
    case "TEXTO":
      return item.valorTexto;
    case "INTEIRO":
      return item.valorInteiro;
    case "DECIMAL":
      return item.valorDecimal === null ? null : Number(item.valorDecimal.toString());
    case "BOOLEANO":
      return item.valorBooleano;
    default:
      return null;
  }
}

export function writeAtributoValor(
  tipoValor: TipoValor,
  valor: string | number | boolean | null,
): {
  valorTexto: string | null;
  valorInteiro: number | null;
  valorDecimal: number | null;
  valorBooleano: boolean | null;
} {
  const empty = {
    valorTexto: null,
    valorInteiro: null,
    valorDecimal: null,
    valorBooleano: null,
  };

  if (valor === null || valor === undefined || valor === "") {
    return empty;
  }

  switch (tipoValor) {
    case "TEXTO":
      return { ...empty, valorTexto: String(valor) };
    case "INTEIRO": {
      const parsed = typeof valor === "number" ? valor : Number(valor);
      if (!Number.isInteger(parsed)) {
        throw new Error("Valor inteiro inválido");
      }
      return { ...empty, valorInteiro: parsed };
    }
    case "DECIMAL": {
      const parsed = typeof valor === "number" ? valor : Number(valor);
      if (Number.isNaN(parsed)) {
        throw new Error("Valor decimal inválido");
      }
      return { ...empty, valorDecimal: parsed };
    }
    case "BOOLEANO":
      if (typeof valor === "boolean") {
        return { ...empty, valorBooleano: valor };
      }
      if (valor === "true" || valor === "1") {
        return { ...empty, valorBooleano: true };
      }
      if (valor === "false" || valor === "0") {
        return { ...empty, valorBooleano: false };
      }
      throw new Error("Valor booleano inválido");
    default:
      return empty;
  }
}

export function atributoValorSignatureKey(
  tipoValor: TipoValor,
  valor: string | number | boolean | null,
): string {
  const columns = writeAtributoValor(tipoValor, valor);

  switch (tipoValor) {
    case "TEXTO":
      return `t:${columns.valorTexto ?? ""}`;
    case "INTEIRO":
      return `i:${columns.valorInteiro ?? ""}`;
    case "DECIMAL":
      return `d:${columns.valorDecimal ?? ""}`;
    case "BOOLEANO":
      return `b:${columns.valorBooleano === null ? "" : columns.valorBooleano ? "1" : "0"}`;
    default:
      return "";
  }
}

export function buildAtributosSignature(
  atributos: Array<{
    atributoId: number;
    tipoValor: TipoValor;
    valor: string | number | boolean | null;
  }>,
): string {
  return atributos
    .map((item) => `${item.atributoId}=${atributoValorSignatureKey(item.tipoValor, item.valor)}`)
    .sort()
    .join("|");
}
