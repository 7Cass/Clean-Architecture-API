import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { IUserRepository } from "../../../../../src/interfaces/repositories/user-repository";
import { ListUsers } from "../../../../../src/application/use-cases/users/list-users";

describe("List Users Use Case", () => {
  let userRepositoryMocked: Mocked<IUserRepository>;
  let listUsersUseCase: ListUsers;

  beforeEach(() => {
    userRepositoryMocked = {
      create: vi.fn(),
      list: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
    };
    listUsersUseCase = new ListUsers(userRepositoryMocked);
  });

  it("should be able to list users", async () => {
    userRepositoryMocked.list.mockResolvedValue([
      { id: "1", name: "John Doe", email: "john@doe", password: "password", books: [] },
      { id: "2", name: "Jane Doe", email: "jane@doe", password: "password", books: [] },
    ]);

    const result = await listUsersUseCase.execute();

    expect(result).toBeDefined();
    expect(result).toEqual([
      { id: "1", name: "John Doe", email: "john@doe", password: "password", books: [] },
      { id: "2", name: "Jane Doe", email: "jane@doe", password: "password", books: [] },
    ]);
  });

  it("should return empty array if no users are found", async () => {
    userRepositoryMocked.list.mockResolvedValue([]);
    const result = await listUsersUseCase.execute();

    expect(result).toBeDefined();
    expect(result).toEqual([]);
  });
});