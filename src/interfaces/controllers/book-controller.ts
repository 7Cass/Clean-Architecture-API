import { FastifyReply, FastifyRequest } from "fastify";
import { CreateBookUseCase } from "../../application/use-cases/books/create-book";
import z from "zod";
import { ListBooksUseCase } from "../../application/use-cases/books/list-books";
import { UpdateBookUseCase } from "../../application/use-cases/books/update-book";

const createBookBodySchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string()
});
type CreateBookBody = z.infer<typeof createBookBodySchema>;

const updateBookBodySchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  userId: z.string().optional(),
});
type UpdateBookBody = z.infer<typeof updateBookBodySchema>;

export class BookController {
  constructor(
    private createBookUseCase: CreateBookUseCase,
    private listBooksUseCase: ListBooksUseCase,
    private updateBookUseCase: UpdateBookUseCase
  ) { }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const book = await this.createBookUseCase.execute(request.body as CreateBookBody);

      return reply.status(201).send(book);
    } catch (error) {
      throw error;
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const books = await this.listBooksUseCase.execute();
      return reply.status(200).send(books);
    } catch (error) {
      throw error;
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const book = await this.updateBookUseCase.execute(id, request.body as UpdateBookBody);
      return reply.status(200).send(book);
    } catch (error) {
      throw error;
    }
  }
}