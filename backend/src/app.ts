import cors from "cors";
import express from "express";
import { routes } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

export { app };
