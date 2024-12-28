import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { IRefreshTokenRepository } from "../../../../../src/interfaces/repositories/refresh-token-repository";
import { RefreshTokenUseCase } from "../../../../../src/application/use-cases/auth/refresh";
import { UnauthorizedError } from "../../../../../src/domain/errors/unauthorized-error";

describe("Refresh Token Use Case", () => {
  let refreshTokenRepositoryMock: Mocked<IRefreshTokenRepository>;
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(() => {
    refreshTokenRepositoryMock = {
      create: vi.fn(),
      findByToken: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepositoryMock);
  });

  it("should be able to refresh token", async () => {
    refreshTokenRepositoryMock.findByToken.mockResolvedValueOnce({
      id: 'mocked-id',
      userId: '1',
      token: 'refresh_token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {} as any
    });
    const result = await refreshTokenUseCase.execute({ refreshToken: "refresh_token" });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("newRefreshToken");
  });

  it("should not be able to refresh token if refresh token is not found", async () => {
    await expect(refreshTokenUseCase.execute({ refreshToken: "invalid_token" })).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should not be able to refresh token if refresh token is expired", async () => {
    refreshTokenRepositoryMock.findByToken.mockResolvedValueOnce({
      id: 'mocked-id',
      userId: '1',
      token: 'refresh_token',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      user: {} as any
    });

    await expect(refreshTokenUseCase.execute({ refreshToken: "refresh_token" })).rejects.toBeInstanceOf(UnauthorizedError);
  });
});