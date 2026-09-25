import type { Prisma, TipoValor } from "@prisma/client";
import {
  atributoValorSignatureKey,
  buildAtributosSignature,
  readAtributoValor,
} from "../../lib/atributoValor.js";
import { AppError } from "../../lib/errors.js";
import type { CreateConsumoInput } from "../../schemas/consumo.js";

export type ResolvedAtributo = {
  atributoId: number;
  tipoValor: TipoValor;
  valor: string | number | boolean | null;
};

export type ConsumoExistenteInfo = {
  id: number;
  nome: string;
  quantidadeEstoque: number;
  atributos: Array<{
    nome: string;
    tipoValor: TipoValor;
    valor: string | number | boolean | null;
  }>;
};

export type ConflitoParcialMotivo = "extras_no_novo" | "subconjunto_do_existente";

export type ConflitoAtributos =
  | { tipo: "exato"; consumo: ConsumoExistenteInfo }
  | { tipo: "parcial"; motivo: ConflitoParcialMotivo; consumo: ConsumoExistenteInfo };

export async function resolveAtributos(
  tx: Prisma.TransactionClient,
  atributos: CreateConsumoInput["atributos"],
): Promise<ResolvedAtributo[]> {
  const resolvedAtributos: ResolvedAtributo[] = [];

  for (const item of atributos) {
    let atributoId = item.atributoId;
    let tipoValor: TipoValor | undefined;

    if (atributoId) {
      const existing = await tx.atributo.findUnique({ where: { id: atributoId } });
      if (!existing) {
        throw new AppError(`Atributo ${atributoId} não encontrado`);
      }
      tipoValor = existing.tipoValor;
    } else {
      const nome = item.nome!.trim();
      const existingByName = await tx.atributo.findFirst({
        where: { nome },
      });

      if (existingByName) {
        atributoId = existingByName.id;
        tipoValor = existingByName.tipoValor;
      } else {
        const createdAtributo = await tx.atributo.create({
          data: {
            nome,
            tipoValor: item.tipoValor!,
          },
        });
        atributoId = createdAtributo.id;
        tipoValor = createdAtributo.tipoValor;
      }
    }

    if (resolvedAtributos.some((entry) => entry.atributoId === atributoId)) {
      throw new AppError("Atributo duplicado no consumo");
    }

    resolvedAtributos.push({
      atributoId,
      tipoValor: tipoValor!,
      valor: item.valor,
    });
  }

  return resolvedAtributos;
}

function toSignatureMap(atributos: ResolvedAtributo[]) {
  return new Map(
    atributos.map((item) => [
      item.atributoId,
      atributoValorSignatureKey(item.tipoValor, item.valor),
    ]),
  );
}

function isAtributosSubset(candidate: ResolvedAtributo[], reference: Map<number, string>) {
  if (candidate.length === 0) {
    return false;
  }

  return candidate.every((item) => {
    return reference.get(item.atributoId) === atributoValorSignatureKey(item.tipoValor, item.valor);
  });
}

export function quantidadeEstoqueOf(consumo: {
  variantes: Array<{ estoque: { quantidade: number } | null }>;
}) {
  return consumo.variantes.reduce((sum, item) => sum + (item.estoque?.quantidade ?? 0), 0);
}

export async function findConflitoAtributos(
  tx: Prisma.TransactionClient,
  resolvedAtributos: ResolvedAtributo[],
  options?: { excludeConsumoId?: number },
): Promise<ConflitoAtributos | null> {
  const signature = buildAtributosSignature(resolvedAtributos);
  const submittedMap = toSignatureMap(resolvedAtributos);

  const consumos = await tx.consumo.findMany({
    where: options?.excludeConsumoId ? { id: { not: options.excludeConsumoId } } : undefined,
    include: {
      variantes: {
        include: {
          estoque: true,
          atributos: {
            include: { atributo: true },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  let melhorParcial: {
    consumo: ConsumoExistenteInfo;
    motivo: ConflitoParcialMotivo;
    score: number;
  } | null = null;

  for (const consumo of consumos) {
    const variante = consumo.variantes[0];
    if (!variante || variante.atributos.length === 0) {
      continue;
    }

    const existingAttrs: ResolvedAtributo[] = variante.atributos.map((item) => ({
      atributoId: item.atributoId,
      tipoValor: item.atributo.tipoValor,
      valor: readAtributoValor(item),
    }));

    const existingSignature = buildAtributosSignature(existingAttrs);
    const existingMap = toSignatureMap(existingAttrs);
    const info: ConsumoExistenteInfo = {
      id: consumo.id,
      nome: consumo.nome,
      quantidadeEstoque: quantidadeEstoqueOf(consumo),
      atributos: variante.atributos.map((item) => ({
        nome: item.atributo.nome,
        tipoValor: item.atributo.tipoValor,
        valor: readAtributoValor(item),
      })),
    };

    if (existingSignature === signature) {
      return { tipo: "exato", consumo: info };
    }

    if (
      existingAttrs.length < resolvedAtributos.length &&
      isAtributosSubset(existingAttrs, submittedMap)
    ) {
      const score = existingAttrs.length;
      if (
        !melhorParcial ||
        melhorParcial.motivo !== "extras_no_novo" ||
        score > melhorParcial.score
      ) {
        melhorParcial = { consumo: info, motivo: "extras_no_novo", score };
      }
      continue;
    }

    if (
      resolvedAtributos.length < existingAttrs.length &&
      isAtributosSubset(resolvedAtributos, existingMap)
    ) {
      const score = -existingAttrs.length;
      if (melhorParcial?.motivo === "extras_no_novo") {
        continue;
      }
      if (
        !melhorParcial ||
        (melhorParcial.motivo === "subconjunto_do_existente" && score > melhorParcial.score)
      ) {
        melhorParcial = { consumo: info, motivo: "subconjunto_do_existente", score };
      }
    }
  }

  if (melhorParcial) {
    return {
      tipo: "parcial",
      motivo: melhorParcial.motivo,
      consumo: melhorParcial.consumo,
    };
  }

  return null;
}

export function assertNoConflitoAtributos(
  conflito: ConflitoAtributos | null,
  forceCreate: boolean,
) {
  if (!conflito) {
    return;
  }

  if (conflito.tipo === "exato") {
    throw new AppError("Já existe um consumo com os mesmos atributos", 409, {
      tipo: "exato",
      consumoExistente: conflito.consumo,
    });
  }

  if (conflito.tipo === "parcial" && !forceCreate) {
    const message =
      conflito.motivo === "extras_no_novo"
        ? "Os atributos informados incluem um consumo já existente, com atributos extras"
        : "Os atributos informados correspondem a parte de um consumo já existente";

    throw new AppError(message, 409, {
      tipo: "parcial",
      motivo: conflito.motivo,
      consumoExistente: conflito.consumo,
    });
  }
}
