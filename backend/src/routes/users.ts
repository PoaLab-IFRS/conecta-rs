import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

usersRouter.post("/", async (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch {
    res.status(409).json({ error: "User with this email already exists" });
  }
});

usersRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { email, name } = req.body as { email?: string; name?: string };

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email, name },
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

export { usersRouter };
