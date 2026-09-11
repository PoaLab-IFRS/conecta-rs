import type { Response } from "express";
import { z } from "zod";

export function parseWithSchema<T>(res: Response, schema: z.ZodType<T>, value: unknown): T | null {
  const result = schema.safeParse(value);
  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return null;
  }

  return result.data;
}
