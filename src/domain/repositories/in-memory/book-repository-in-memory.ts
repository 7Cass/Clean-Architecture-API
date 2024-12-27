import { randomUUID } from "node:crypto";
import { IBookRepository } from "../../../interfaces/repositories/book-repository";
import { Book } from "../../entities/book";
import { Prisma } from "@prisma/client";
import { ConflictError } from "../../errors/conflict-error";
import { NotFoundError } from "../../errors/not-found-error";

export class BookRepositoryInMemory implements IBookRepository {
  private books: Book[] = [];

  async list(): Promise<Book[]> {
    return this.books;
  }

  async create(book: Pick<Book, "title" | "author" | "description">): Promise<Book> {
    const newBook: Book = {
      id: randomUUID(),
      userId: null,
      user: null,
      ...book
    };
    this.books.push(newBook);
    return newBook;
  }

  async update(bookId: string, book: Prisma.BookUpdateInput): Promise<Book> {
    const bookIndex = this.books.findIndex((book) => book.id === bookId);
    const updatedBook = {
      ...this.books[bookIndex],
      ...book,
    } as Book;
    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  async delete(bookId: string): Promise<void> {
    const bookIndex = this.books.findIndex((book) => book.id === bookId);
    this.books.splice(bookIndex, 1);
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find((book) => book.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Book[] | null> {
    return this.books.filter((book) => book.userId === userId) || null;
  }

  async findByTitle(title: string): Promise<Book | null> {
    return this.books.find((book) => book.title === title) || null;
  }
}