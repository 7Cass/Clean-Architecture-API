import z from "zod";
import { FastifyTypedInstance } from "../../types/fastify/fastify-instance";
import { authMiddleware } from "../../infrastructure/middlewares/auth-middleware";
import { bookSchema, createBookSchema, updateBookSchema } from "../../domain/schemas/book.schema";

export async function bookRoutes(app: FastifyTypedInstance) {
  const bookController = app.bookController;

  app.get('/books', {
    preHandler: [authMiddleware],
    schema: {
      description: "List all books",
      tags: ["Books"],
      response: {
        200: bookSchema,
      }
    }
  }, (request, reply) => bookController.list(request, reply));

  app.post('/books', {
    preHandler: [authMiddleware],
    schema: {
      description: "Create a new book",
      tags: ["Books"],
      body: createBookSchema,
      response: bookSchema,
    }
  }, (request, reply) => bookController.create(request, reply));

  app.patch('/books/:id', {
    preHandler: [authMiddleware],
    schema: {
      description: "Update a book",
      tags: ["Books"],
      body: updateBookSchema,
      response: {
        200: bookSchema,
      }
    }
  }, (request, reply) => bookController.update(request, reply));
}