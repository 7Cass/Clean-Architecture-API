import { describe, expect, it, beforeEach, vi } from "vitest";
import { UserRepositoryInMemory } from "../../../../../src/domain/repositories/in-memory/user-repository-in-memory";
import { LoginUseCase } from "../../../../../src/application/use-cases/auth/login";
import { RefreshTokenRepositoryInMemory } from "../../../../../src/domain/repositories/in-memory/refresh-token-repository-in-memory";
import bcrypt from "bcrypt";
import { User } from "../../../../../src/domain/entities/user";
import { IRefreshTokenRepository } from "../../../../../src/interfaces/repositories/refresh-token-repository";

describe("Login Use Case", () => {
  let userRepository: UserRepositoryInMemory;
  let refreshTokenRepositoryMock: IRefreshTokenRepository;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    refreshTokenRepositoryMock = {
      create: vi.fn().mockResolvedValue({
        id: "mocked-id",
        userId: "1",
        token: "mocked-refresh-token",
        createdAt: new Date(),
      }),
      findByToken: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({
        id: "mocked-id",
        userId: "1",
        token: "updated-refresh-token",
        createdAt: new Date(),
      }),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    loginUseCase = new LoginUseCase(userRepository, refreshTokenRepositoryMock);
  });

  it("should be able to login with valid credentials", async () => {
    const passwordHash = await bcrypt.hash("12345678", 10);
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      password: passwordHash,
    };
    const newUser = await userRepository.create(user);
    const result = await loginUseCase.execute({
      email: newUser.email,
      password: "12345678",
    });

    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
  });

  it("should not be able to login with invalid credentials", async () => {
    const passwordHash = await bcrypt.hash("12345678", 10);
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      password: passwordHash,
    };
    await userRepository.create(user);
    await expect(loginUseCase.execute({
      email: user.email,
      password: "wrong-password",
    })).rejects.toThrowError("Email or password invalid.");

    await expect(loginUseCase.execute({
      email: "wrong-email",
      password: "12345678",
    })).rejects.toThrowError("Email or password invalid.");
  })
});