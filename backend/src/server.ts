import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
    validatorCompiler,
    serializerCompiler,
    jsonSchemaTransform,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { userRoutes } from "./routes/userRoutes";
import { capitalRoutes } from "./routes/capitalRoutes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: "*",
});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "PoaLab: School Inventory",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});

app.register(userRoutes);
app.register(capitalRoutes);

app.get("/", async () => {
    return "Hello World";
});

async function start() {
    try {
        // Garante que todas as rotas/plugins estejam carregados
        await app.ready();

        // Gera a documentação Swagger
        const swagger = app.swagger();

        // Cria a pasta docs caso ela não exista
        const docsPath = path.join(process.cwd(), "docs");

        await mkdir(docsPath, {
            recursive: true,
        });

        // Caminho do arquivo swagger.json
        const swaggerFile = path.join(
            docsPath,
            "swagger.json"
        );

        // Salva o JSON
        await writeFile(
            swaggerFile,
            JSON.stringify(swagger, null, 2),
            "utf-8"
        );

        console.log(`Swagger gerado em: ${swaggerFile}`);

        await app.listen({
            port: 3000,
        });

        console.log("HTTP server running on http://localhost:3000");
        console.log("Swagger UI: http://localhost:3000/docs");

    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();