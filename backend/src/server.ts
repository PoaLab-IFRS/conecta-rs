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

app.listen({
    port: 3000,
}).then(() => {
    console.log("HTTP server running");
});
