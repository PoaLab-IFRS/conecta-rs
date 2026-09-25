import type { AtributoValor, TipoValor } from "../models/consumo";
import { formatAtributoValor } from "./formatAtributo";

export function buildConsumoNomeFromAtributos(
  atributos: Array<{ nome: string; tipoValor: TipoValor | ""; valor: string }>,
): string {
  return atributos
    .filter((item) => item.nome.trim() && item.tipoValor && item.valor.trim() !== "")
    .map((item) => {
      const atributo: AtributoValor = {
        nome: item.nome,
        tipoValor: item.tipoValor as TipoValor,
        valor:
          item.tipoValor === "BOOLEANO"
            ? item.valor === "true"
            : item.tipoValor === "INTEIRO"
              ? Number.parseInt(item.valor, 10)
              : item.tipoValor === "DECIMAL"
                ? Number(item.valor)
                : item.valor.trim(),
      };
      return formatAtributoValor(atributo);
    })
    .filter((value) => value !== "—")
    .join(" · ");
}
