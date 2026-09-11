import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import { idParam, updateItemCapitalSchema } from "../schemas/index.js";

const itensCapitalRouter = Router();

itensCapitalRouter.get("/", async (_req, res) => {
  const itens = await prisma.itemCapital.findMany({
    orderBy: { id: "desc" },
    include: {
      variante: {
        include: { material: true },
      },
    },
  });
  res.json(itens);
});

itensCapitalRouter.get("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const item = await prisma.itemCapital.findUnique({
    where: { id: params.id },
    include: {
      variante: {
        include: { material: true },
      },
    },
  });

  if (!item) {
    res.status(404).json({ error: "Item capital not found" });
    return;
  }

  res.json(item);
});

itensCapitalRouter.put("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, updateItemCapitalSchema, req.body);
  if (!body) {
    return;
  }

  try {
    const item = await prisma.itemCapital.update({
      where: { id: params.id },
      data: body,
    });
    res.json(item);
  } catch (error) {
    const message = String(error);
    if (message.includes("Unique constraint")) {
      res.status(409).json({ error: "numeroPatrimonio already exists" });
      return;
    }
    res.status(404).json({ error: "Item capital not found" });
  }
});

itensCapitalRouter.delete("/:id", async (req, res) => {
  const params = parseWithSchema(res, idParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.itemCapital.delete({ where: { id: params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Item capital not found" });
  }
});

export { itensCapitalRouter };
