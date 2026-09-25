import type { AtributoValor } from "../models/consumo";

export function formatAtributoValor(atributo: AtributoValor): string {
  if (atributo.valor === null || atributo.valor === undefined) {
    return "—";
  }
  if (atributo.tipoValor === "BOOLEANO") {
    return atributo.valor ? "Sim" : "Não";
  }
  return String(atributo.valor);
}
