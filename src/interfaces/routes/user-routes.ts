import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";
import { authMiddleware } from "../../infrastructure/middlewares/auth-middleware";
import { userSchema, usersSchema } from "../../domain/schemas/user.schema";

export async function userRoutes(app: FastifyTypedInstance) {
  const userController = app.userController;

  app.get('/users', {
    preHandler: [authMiddleware],
    schema: {
      description: 'List users',
      tags: ['Users'],
      response: {
        200: usersSchema
      }
    }
  }, (request, reply) => {
    userController.listUsers(request, reply)
  });

  app.post('/users', {
    schema: {
      description: "Create a new user",
      tags: ["Users"],
      body: userSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
      }
    }
  }, (request, reply) => userController.createUser(request, reply));
}