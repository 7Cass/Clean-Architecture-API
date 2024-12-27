import { Prisma } from "@prisma/client";
import { Book } from "../../domain/entities/book";

export interface IBookRepository {
  list(): Promise<Book[]>;
  create(book: Book): Promise<Book>;
  update(bookId: string, book: Prisma.BookUpdateInput): Promise<Book>;
  delete(bookId: string): Promise<void>;
  findById(id: string): Promise<Book | null>;
  findByUserId(userId: string): Promise<Book[] | null>;
  findByTitle(title: string): Promise<Book | null>;
}