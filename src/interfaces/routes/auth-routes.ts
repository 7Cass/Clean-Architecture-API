import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";
import { authSchema } from "../../domain/schemas/auth.schema";

export async function authRoutes(app: FastifyTypedInstance) {
  const authController = app.authController;

  app.post('/auth/login', {
    schema: {
      description: "Create a new login session",
      tags: ["Auth"],
      security: [{
        CookieAuth: []
      }],
      body: authSchema
    }
  }, (request, reply) => authController.login(request, reply));

  app.post('/auth/refresh', {
    schema: {
      description: "Create a new refresh token and session",
      tags: ["Auth"],
      security: [{
        CookieAuth: []
      }],
    }
  }, (request, reply) => authController.refresh(request, reply));

  app.post('/auth/logout', {
    schema: {
      description: "Logout user",
      tags: ["Auth"],
      security: [{
        CookieAuth: []
      }],
    }
  }, (request, reply) => authController.logout(request, reply));
}