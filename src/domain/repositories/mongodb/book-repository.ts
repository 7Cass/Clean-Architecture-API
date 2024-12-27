import { Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import { IBookRepository } from "../../../interfaces/repositories/book-repository";
import { Book } from "../../entities/book";

export class MongoBookRepository implements IBookRepository {
  async list(): Promise<Book[]> {
    return await prisma.book.findMany({ include: { user: true } });
  }

  async create(book: Pick<Book, "title" | "author" | "description">): Promise<Book> {
    return await prisma.book.create({ data: book });
  }

  async update(bookId: string, book: Prisma.BookUpdateInput): Promise<Book> {
    return await prisma.book.update({
      where: { id: bookId }, data: book,
      include: { user: true }
    });
  }

  async delete(bookId: string): Promise<void> {
    await prisma.book.delete({ where: { id: bookId } });
  }

  async findById(id: string): Promise<Book | null> {
    return await prisma.book.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Book[] | null> {
    return await prisma.book.findMany({ where: { userId } });
  }

  async findByTitle(title: string): Promise<Book | null> {
    return await prisma.book.findUnique({ where: { title } });
  }
}