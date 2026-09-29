import cors from "@fastify/cors";
import Fastify from "fastify";
import { 
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { routes } from "./routes/index.js";

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(cors);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "PoaLab: School Inventory",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
  });

  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler((err, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
      return reply.status(400).send({
         error: "Erro de validação",
          details: err.validation, 
        });
    }
    console.error(err);
    reply.status(500).send({ error: "Erro interno do servidor" });
  });

  return app;
}
