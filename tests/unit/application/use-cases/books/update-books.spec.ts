import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { IBookRepository } from "../../../../../src/interfaces/repositories/book-repository";
import { UpdateBookUseCase } from "../../../../../src/application/use-cases/books/update-book";
import { IUserRepository } from "../../../../../src/interfaces/repositories/user-repository";
import { User } from "../../../../../src/domain/entities/user";
import { Book } from "../../../../../src/domain/entities/book";
import { NotFoundError } from "../../../../../src/domain/errors/not-found-error";

describe("Update Book Use Case", () => {
  let bookRepositoryMocked: Mocked<IBookRepository>;
  let userRepositoryMocked: Mocked<IUserRepository>;
  let updateBookUseCase: UpdateBookUseCase;

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
    userRepositoryMocked = {
      list: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    updateBookUseCase = new UpdateBookUseCase(bookRepositoryMocked, userRepositoryMocked);
  });

  it("should be able to update a book", async () => {
    const newUser: User = {
      id: "mocked-user-id",
      name: "John Doe",
      email: "john@doe",
      password: "password",
      books: [],
    };
    userRepositoryMocked.findById.mockResolvedValue(newUser);

    bookRepositoryMocked.findById.mockResolvedValue({
      id: "mocked-id",
      author: "Book Author",
      title: "Book Title",
      description: "Book Description",
    });

    bookRepositoryMocked.update.mockResolvedValue({
      id: "mocked-id",
      title: "Updated Title",
      author: "Updated Author",
      description: "Updated Description",
      userId: "mocked-user-id",
      user: newUser
    });

    const result = await updateBookUseCase.execute('mocked-id', {
      title: "Updated Title",
      author: "Updated Author",
      description: "Updated Description",
      userId: "mocked-user-id"
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.userId).toBe("mocked-user-id");
    expect(result.title).toBe("Updated Title");
    expect(result.author).toBe("Updated Author");
    expect(result.description).toBe("Updated Description");
  });

  it("should throw an error if book does not exist", async () => {
    await expect(updateBookUseCase.execute('mocked-id', {
      title: "Updated Title",
      author: "Updated Author",
      description: "Updated Description",
      userId: "mocked-user-id"
    })).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should throw an error if user from userId does not exist", async () => {
    bookRepositoryMocked.findById.mockResolvedValue({
      id: "mocked-id",
      author: "Book Author",
      title: "Book Title",
      description: "Book Description",
    });

    await expect(updateBookUseCase.execute('mocked-id', {
      title: "Updated Title",
      author: "Updated Author",
      description: "Updated Description",
      userId: "mocked-user-id"
    })).rejects.toBeInstanceOf(NotFoundError);
  });
});