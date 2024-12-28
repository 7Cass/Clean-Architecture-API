import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { IBookRepository } from "../../../../../src/interfaces/repositories/book-repository";
import { CreateBookUseCase } from "../../../../../src/application/use-cases/books/create-book";
import { ConflictError } from "../../../../../src/domain/errors/conflict-error";
import { BadRequestError } from "../../../../../src/domain/errors/bad-request-error";
import { ListBooksUseCase } from "../../../../../src/application/use-cases/books/list-books";

describe("Create Book Use Case", () => {
  let bookRepositoryMocked: Mocked<IBookRepository>;
  let listBookUseCase: ListBooksUseCase;

  beforeEach(() => {
    bookRepositoryMocked = {
      create: vi.fn(),
      list: vi.fn(),
      findById: vi.fn(),
      findByTitle: vi.fn(),
      findByUserId: vi.fn(),
      delete: vi.fn(),
      update: vi.fn()
    };
    listBookUseCase = new ListBooksUseCase(bookRepositoryMocked);
  });

  it("should be able to list all books", async () => {
    bookRepositoryMocked.list.mockResolvedValue([
      { id: "mocked-id", author: "Book Author", title: "Book Title", description: "Book Description" },
      { id: "mocked-id-2", author: "Book Author", title: "Book Title 2", description: "Book Description" },
    ]);

    const result = await listBookUseCase.execute();
    expect(result).toBeDefined();
    expect(result).toEqual([
      { id: "mocked-id", author: "Book Author", title: "Book Title", description: "Book Description" },
      { id: "mocked-id-2", author: "Book Author", title: "Book Title 2", description: "Book Description" },
    ]);
  });

  it("should return an empty array if there are no books", async () => {
    bookRepositoryMocked.list.mockResolvedValue([]);
    const result = await listBookUseCase.execute();
    expect(result).toBeDefined();
    expect(result).toEqual([]);
  });
});