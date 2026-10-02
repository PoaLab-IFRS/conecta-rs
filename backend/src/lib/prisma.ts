import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";

declare global {
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL não está definida no arquivo .env");
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
// import { PrismaClient } from "@prisma/client";

// declare global {
//   var __prisma: PrismaClient | undefined;
// }

// export const prisma =
//   globalThis.__prisma ??
//   new PrismaClient({
//     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalThis.__prisma = prisma;
// }
