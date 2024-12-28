import { describe, it, expect, Mocked, vi, beforeEach } from "vitest";
import { IUserRepository } from "../../../../../src/interfaces/repositories/user-repository";
import { CreateUserUseCase } from "../../../../../src/application/use-cases/users/create-user";
import { ConflictError } from "../../../../../src/domain/errors/conflict-error";
import { BadRequestError } from "../../../../../src/domain/errors/bad-request-error";

describe("Create User Use Case", () => {
  let userRepositoryMocked: Mocked<IUserRepository>;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepositoryMocked = {
      list: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    createUserUseCase = new CreateUserUseCase(userRepositoryMocked);
  });

  it("should be able to create a new user", async () => {
    userRepositoryMocked.create.mockResolvedValue({
      id: "mocked-id",
      name: "John Doe",
      email: "john@doe.com",
      password: "password",
      books: [],
    });
    const result = await createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "password"
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("password");
    expect(result).toHaveProperty("books");
  });

  it("should throw an error if email already exists", async () => {
    userRepositoryMocked.create.mockResolvedValue({
      id: "mocked-id",
      name: "John Doe",
      email: "john@doe.com",
      password: "password",
      books: [],
    });
    userRepositoryMocked.findByEmail.mockResolvedValue({
      id: "mocked-id",
      name: "John Doe",
      email: "john@doe.com",
      password: "password",
      books: [],
    });

    await expect(createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "password"
    })).rejects.toBeInstanceOf(ConflictError);
  });

  it("should throw an error if password is less than 8 characters", async () => {
    userRepositoryMocked.create.mockResolvedValue({
      id: "mocked-id",
      name: "John Doe",
      email: "john@doe.com",
      password: "pass"
    });
    await expect(createUserUseCase.execute({
      name: "John Doe",
      email: "john@doe.com",
      password: "pass"
    })).rejects.toBeInstanceOf(BadRequestError);
  });
});