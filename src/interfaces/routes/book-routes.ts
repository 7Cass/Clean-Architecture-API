import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";
import { authMiddleware } from "../../infrastructure/middlewares/auth-middleware";

export async function bookRoutes(app: FastifyTypedInstance) {
  const bookController = app.bookController;

  app.get('/books', {
    preHandler: [authMiddleware],
    schema: {
      description: "List all books",
      tags: ["Books"],
      response: {
        200: z.array(z.object({
          id: z.string(),
          title: z.string(),
          author: z.string(),
          description: z.string(),
          userId: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            password: z.string(),
          }).nullable()
        })),
      }
    }
  }, (request, reply) => bookController.list(request, reply));

  app.post('/books', {
    preHandler: [authMiddleware],
    schema: {
      description: "Create a new book",
      tags: ["Books"],
      body: z.object({
        title: z.string(),
        author: z.string(),
        description: z.string(),
      }),
      response: {
        201: z.object({
          id: z.string(),
          title: z.string(),
          author: z.string(),
          description: z.string(),
          userId: z.string().nullable()
        }),
      }
    }
  }, (request, reply) => bookController.create(request, reply));

  app.patch('/books/:id', {
    preHandler: [authMiddleware],
    schema: {
      description: "Update a book",
      tags: ["Books"],
      body: z.object({
        title: z.string().optional(),
        author: z.string().optional(),
        description: z.string().optional(),
        userId: z.string().optional(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          title: z.string(),
          author: z.string(),
          description: z.string(),
          userId: z.string().nullable(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            password: z.string(),
          }).nullable()
        }),
      }
    }
  }, (request, reply) => bookController.update(request, reply));
}