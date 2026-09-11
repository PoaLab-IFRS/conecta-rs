import { Router } from "express";
import { usersRouter } from "./users.js";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use("/users", usersRouter);

export { routes };
