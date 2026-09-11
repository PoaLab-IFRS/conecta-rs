import { Router } from "express";
import { usersRouter } from "./users.js";
import { materiaisRouter } from "./materiais.js";
import { atributosRouter } from "./atributos.js";
import { variantesRouter } from "./variantes.js";
import { itensCapitalRouter } from "./itens-capital.js";
import "../lib/ids.js";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use("/users", usersRouter);
routes.use("/materiais", materiaisRouter);
routes.use("/atributos", atributosRouter);
routes.use("/variantes", variantesRouter);
routes.use("/itens-capital", itensCapitalRouter);

export { routes };
