import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { IBookRepository } from "../../../../../src/interfaces/repositories/book-repository";
import { CreateBookUseCase } from "../../../../../src/application/use-cases/books/create-book";
import { ConflictError } from "../../../../../src/domain/errors/conflict-error";
import { BadRequestError } from "../../../../../src/domain/errors/bad-request-error";

describe("Create Book Use Case", () => {
  let bookRepositoryMocked: Mocked<IBookRepository>;
  let createBookUseCase: CreateBookUseCase;

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
    createBookUseCase = new CreateBookUseCase(bookRepositoryMocked);
  });

  it("should be able to create a new book", async () => {
    bookRepositoryMocked.create.mockResolvedValue({
      id: "mocked-id",
      author: "Book Author",
      title: "Book Title",
      description: "Book Description",
      user: {} as any,
      userId: null,
    });
    const result = await createBookUseCase.execute({
      author: "Book Author",
      title: "Book Title",
      description: "Book Description"
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("author");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("userId");
  });

  it("should not be able to create a new book if book already exists", async () => {
    bookRepositoryMocked.findByTitle.mockResolvedValueOnce({
      id: "mocked-id",
      author: "Book Author",
      title: "Book Title",
      description: "Book Description",
    });
    await expect(createBookUseCase.execute({
      author: "Book Author",
      title: "Book Title",
      description: "Book Description"
    })).rejects.toBeInstanceOf(ConflictError);
  });

  it("should not be able to create a new book if book title is empty", async () => {
    bookRepositoryMocked.create.mockResolvedValue({
      id: "mocked-id",
      author: "Book Author",
      title: "",
      description: "Book Description",
      user: {} as any,
      userId: null,
    });
    await expect(createBookUseCase.execute({
      author: "Book Author",
      title: "",
      description: "Book Description"
    })).rejects.toBeInstanceOf(BadRequestError);
  });
});