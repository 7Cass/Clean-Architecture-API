import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";
import { authMiddleware } from "../../infrastructure/middlewares/auth-middleware";

export async function userRoutes(app: FastifyTypedInstance) {
  const userController = app.userController;

  app.get('/users', {
    preHandler: [authMiddleware],
    schema: {
      description: 'List users',
      tags: ['Users'],
      response: {
        200: z.array(z.object({ // @TODO: Criar um schema para user
          id: z.string(),
          name: z.string(),
          email: z.string(),
          books: z.array(z.object({
            id: z.string(),
            title: z.string(),
            author: z.string(),
            description: z.string(),
            userId: z.string().nullable()
          }))
        }))
      }
    }
  }, (request, reply) => {
    userController.listUsers(request, reply)
  });

  app.post('/users', {
    schema: {
      description: "Create a new user",
      tags: ["Users"],
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        books: z.array(z.object({
          id: z.string(),
          title: z.string(),
          author: z.string(),
          description: z.string(),
          userId: z.string().nullable()
        })).optional()
      }),
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