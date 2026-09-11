import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import {
  createItemCapitalSchema,
  idAndAtributoParam,
  idParam,
  updateEstoqueSchema,
  valorAtributoSchema,
} from "../schemas/index.js";

const variantesRouter = Router();

variantesRouter.get("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const variante = await prisma.varianteMaterial.findUnique({
    where: { id: params.id },
    include: {
      material: true,
      estoque: true,
      atributos: { include: { atributo: true } },
      itens: { orderBy: { id: "desc" } },
    },
  });

  if (!variante) {
    res.status(404).json({ error: "Variante not found" });
    return;
  }

  res.json(variante);
});

variantesRouter.delete("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.varianteMaterial.delete({ where: { id: params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Variante not found" });
  }
});

variantesRouter.get("/:id/estoque", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const estoque = await prisma.estoque.findUnique({
    where: { varianteMaterialId: params.id },
  });

  if (!estoque) {
    res.status(404).json({ error: "Estoque not found for this variante" });
    return;
  }

  res.json(estoque);
});

variantesRouter.put("/:id/estoque", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, updateEstoqueSchema, req.body);
  if (!body) {
    return;
  }

  const variante = await prisma.varianteMaterial.findUnique({
    where: { id: params.id },
    include: { material: true },
  });

  if (!variante) {
    res.status(404).json({ error: "Variante not found" });
    return;
  }

  if (variante.material.tipo !== "CONSUMIVEL") {
    res.status(400).json({
      error: "Estoque is only available for materials of tipo CONSUMIVEL",
    });
    return;
  }

  const estoque = await prisma.estoque.upsert({
    where: { varianteMaterialId: params.id },
    create: {
      varianteMaterialId: params.id,
      quantidade: body.quantidade,
    },
    update: { quantidade: body.quantidade },
  });

  res.json(estoque);
});

variantesRouter.put("/:id/atributos/:atributoId", async (req, res) => {
  const params = parseWithSchema(res, idAndAtributoParam, req.params);
  if (!params) {
    return;
  }

  const variante = await prisma.varianteMaterial.findUnique({
    where: { id: params.id },
  });
  if (!variante) {
    res.status(404).json({ error: "Variante not found" });
    return;
  }

  const allowed = await prisma.materialAtributo.findUnique({
    where: {
      materialId_atributoId: {
        materialId: variante.materialId,
        atributoId: params.atributoId,
      },
    },
    include: { atributo: true },
  });

  if (!allowed) {
    res.status(400).json({
      error: "Atributo is not linked to this material",
    });
    return;
  }

  const valores = parseWithSchema(res, valorAtributoSchema(allowed.atributo.tipoValor), req.body);
  if (!valores) {
    return;
  }

  const registro = await prisma.varianteAtributo.upsert({
    where: {
      varianteMaterialId_atributoId: {
        varianteMaterialId: params.id,
        atributoId: params.atributoId,
      },
    },
    create: {
      varianteMaterialId: params.id,
      atributoId: params.atributoId,
      ...valores,
    },
    update: valores,
    include: { atributo: true },
  });

  res.json(registro);
});

variantesRouter.delete("/:id/atributos/:atributoId", async (req, res) => {
  const params = parseWithSchema(res, idAndAtributoParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.varianteAtributo.delete({
      where: {
        varianteMaterialId_atributoId: {
          varianteMaterialId: params.id,
          atributoId: params.atributoId,
        },
      },
    });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Variante atributo not found" });
  }
});

variantesRouter.get("/:id/itens-capital", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const variante = await prisma.varianteMaterial.findUnique({
    where: { id: params.id },
  });
  if (!variante) {
    res.status(404).json({ error: "Variante not found" });
    return;
  }

  const itens = await prisma.itemCapital.findMany({
    where: { varianteMaterialId: params.id },
    orderBy: { id: "desc" },
  });

  res.json(itens);
});

variantesRouter.post("/:id/itens-capital", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, createItemCapitalSchema, req.body);
  if (!body) {
    return;
  }

  const variante = await prisma.varianteMaterial.findUnique({
    where: { id: params.id },
    include: { material: true },
  });

  if (!variante) {
    res.status(404).json({ error: "Variante not found" });
    return;
  }

  if (variante.material.tipo !== "CAPITAL") {
    res.status(400).json({
      error: "Itens de capital are only available for materials of tipo CAPITAL",
    });
    return;
  }

  try {
    const item = await prisma.itemCapital.create({
      data: {
        varianteMaterialId: params.id,
        numeroPatrimonio: body.numeroPatrimonio,
        dataBaixa: body.dataBaixa ?? null,
      },
    });
    res.status(201).json(item);
  } catch {
    res.status(409).json({ error: "numeroPatrimonio already exists" });
  }
});

export { variantesRouter };
