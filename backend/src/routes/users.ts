import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../lib/validate.js";
import { createUserSchema, updateUserSchema, userIdParam } from "../schemas/index.js";

const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const params = parseWithSchema(res, userIdParam, req.params);
  if (!params) {
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  const body = parseWithSchema(res, createUserSchema, req.body);
  if (!body) {
    return;
  }

  try {
    const user = await prisma.user.create({
      data: { email: body.email, name: body.name },
    });
    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: "User with this email already exists" });
  }
});

usersRouter.put("/:id", async (req, res) => {
  const params = parseWithSchema(res, userIdParam, req.params);
  if (!params) {
    return;
  }

  const body = parseWithSchema(res, updateUserSchema, req.body);
  if (!body) {
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  const params = parseWithSchema(res, userIdParam, req.params);
  if (!params) {
    return;
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

export { usersRouter };
