import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import { createAtributoSchema, idParam, updateAtributoSchema } from "../schemas/index.js";

const atributosRouter = Router();

atributosRouter.get("/", async (_req, res) => {
  const atributos = await prisma.atributo.findMany({
    orderBy: { id: "desc" },
  });
  res.json(atributos);
});

atributosRouter.get("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const atributo = await prisma.atributo.findUnique({
    where: { id: params.id },
  });
  if (!atributo) {
    res.status(404).json({ error: "Atributo not found" });
    return;
  }

  res.json(atributo);
});

atributosRouter.post("/", async (req, res) => {
  const body = parseWithSchema(res, createAtributoSchema, req.body);
  if (!body) {
    return;
  }

  const atributo = await prisma.atributo.create({
    data: {
      nome: body.nome,
      tipoValor: body.tipoValor,
    },
  });

  res.status(201).json(atributo);
});

atributosRouter.put("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, updateAtributoSchema, req.body);
  if (!body) {
    return;
  }

  try {
    const atributo = await prisma.atributo.update({
      where: { id: params.id },
      data: body,
    });
    res.json(atributo);
  } catch {
    res.status(404).json({ error: "Atributo not found" });
  }
});

atributosRouter.delete("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.atributo.delete({ where: { id: params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Atributo not found" });
  }
});

export { atributosRouter };
