import { prisma } from "../../lib/prisma.js";
import type { ListUserQuery } from "../../schemas/user.js";

export async function listUser(query: ListUserQuery) {
  const { page, pageSize, name, email, tipoUser } = query;

  const where = {
    ...(name?.trim() && {
      name: { contains: name.trim() },
    }),
    ...(email?.trim() && {
      email: { contains: email.trim() },
    }),
    ...(tipoUser && {
      tipoUser,
    }),
  };

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: rows.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      tipoUser: user.tipoUser,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
    page,
    pageSize,
    total,
  };
}