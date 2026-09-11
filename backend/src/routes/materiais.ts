import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import {
  createMaterialSchema,
  createVarianteSchema,
  idAndAtributoParam,
  idParam,
  linkAtributoSchema,
  updateMaterialSchema,
} from "../schemas/index.js";

const materiaisRouter = Router();

materiaisRouter.get("/", async (_req, res) => {
  const materiais = await prisma.material.findMany({
    orderBy: { id: "desc" },
    include: {
      atributos: { include: { atributo: true } },
      _count: { select: { variantes: true } },
    },
  });
  res.json(materiais);
});

materiaisRouter.get("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id },
    include: {
      atributos: { include: { atributo: true } },
      variantes: {
        include: {
          estoque: true,
          atributos: { include: { atributo: true } },
          _count: { select: { itens: true } },
        },
      },
    },
  });

  if (!material) {
    res.status(404).json({ error: "Material not found" });
    return;
  }

  res.json(material);
});

materiaisRouter.post("/", async (req, res) => {
  const body = parseWithSchema(res, createMaterialSchema, req.body);
  if (!body) {
    return;
  }

  const material = await prisma.material.create({
    data: {
      nome: body.nome,
      descricao: body.descricao ?? null,
      tipo: body.tipo,
    },
  });

  res.status(201).json(material);
});

materiaisRouter.put("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, updateMaterialSchema, req.body);
  if (!body) {
    return;
  }

  try {
    const material = await prisma.material.update({
      where: { id: params.id },
      data: body,
    });
    res.json(material);
  } catch {
    res.status(404).json({ error: "Material not found" });
  }
});

materiaisRouter.delete("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.material.delete({ where: { id: params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Material not found" });
  }
});

materiaisRouter.post("/:id/atributos", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, linkAtributoSchema, req.body);
  if (!body) {
    return;
  }

  const [material, atributo] = await Promise.all([
    prisma.material.findUnique({ where: { id: params.id } }),
    prisma.atributo.findUnique({ where: { id: body.atributoId } }),
  ]);

  if (!material) {
    res.status(404).json({ error: "Material not found" });
    return;
  }
  if (!atributo) {
    res.status(404).json({ error: "Atributo not found" });
    return;
  }

  try {
    const link = await prisma.materialAtributo.create({
      data: { materialId: params.id, atributoId: body.atributoId },
      include: { atributo: true },
    });
    res.status(201).json(link);
  } catch {
    res.status(409).json({ error: "Atributo already linked to material" });
  }
});

materiaisRouter.delete("/:id/atributos/:atributoId", async (req, res) => {
  const params = parseWithSchema(res, idAndAtributoParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.materialAtributo.delete({
      where: {
        materialId_atributoId: {
          materialId: params.id,
          atributoId: params.atributoId,
        },
      },
    });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Link not found" });
  }
});

materiaisRouter.get("/:id/variantes", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id },
  });
  if (!material) {
    res.status(404).json({ error: "Material not found" });
    return;
  }

  const variantes = await prisma.varianteMaterial.findMany({
    where: { materialId: params.id },
    include: {
      estoque: true,
      atributos: { include: { atributo: true } },
      _count: { select: { itens: true } },
    },
    orderBy: { id: "desc" },
  });

  res.json(variantes);
});

materiaisRouter.post("/:id/variantes", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, createVarianteSchema, req.body ?? {});
  if (!body) {
    return;
  }

  const material = await prisma.material.findUnique({
    where: { id: params.id },
  });
  if (!material) {
    res.status(404).json({ error: "Material not found" });
    return;
  }

  const variante = await prisma.varianteMaterial.create({
    data: {
      materialId: params.id,
      ...(material.tipo === "CONSUMIVEL"
        ? { estoque: { create: { quantidade: body.quantidadeInicial } } }
        : {}),
    },
    include: {
      estoque: true,
      atributos: { include: { atributo: true } },
    },
  });

  res.status(201).json(variante);
});

export { materiaisRouter };
