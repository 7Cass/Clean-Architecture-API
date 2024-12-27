import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyTypedInstance } from "../../../types/fastify/fastify-instance";
import { dependencyInjection } from "./dependecy-injection";
import { setupErrorHandler } from "./error-handler";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "../../../interfaces/routes/user-routes";
import { authRoutes } from "../../../interfaces/routes/auth-routes";
import { bookRoutes } from "../../../interfaces/routes/book-routes";

export function createApp(): FastifyTypedInstance {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.register(dependencyInjection);
  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  setupErrorHandler(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, { origin: "*", credentials: true });
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify Clean Arch Bookstore API",
        version: "1.0.0"
      },
      components: {
        securitySchemes: {
          CookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "auth_token",
            description: "Authorization based in HTTP-Only Cookie."
          }
        }
      }
    },
    transform: jsonSchemaTransform,
  });
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  });

  app.register(userRoutes);
  app.register(authRoutes);
  app.register(bookRoutes);

  return app as FastifyTypedInstance;
}