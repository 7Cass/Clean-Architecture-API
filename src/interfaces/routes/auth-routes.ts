import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";

export async function authRoutes(app: FastifyTypedInstance) {
  const authController = app.authController;

  app.post('/auth/login', {
    schema: {
      description: "Create a new login session",
      tags: ["Auth"],
      security: [{
        CookieAuth: []
      }],
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
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