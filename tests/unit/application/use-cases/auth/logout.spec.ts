import { describe, expect, it, Mocked, vi, beforeEach } from "vitest";
import { LogoutUseCase } from "../../../../../src/application/use-cases/auth/logout";
import { IRefreshTokenRepository } from "../../../../../src/interfaces/repositories/refresh-token-repository";
import { UnauthorizedError } from "../../../../../src/domain/errors/unauthorized-error";

describe("Logout Use Case", () => {
  let refreshTokenRepositoryMock: Mocked<IRefreshTokenRepository>;
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    refreshTokenRepositoryMock = {
      create: vi.fn().mockResolvedValue({
        id: "mocked-id",
        userId: "1",
        token: "mocked-refresh-token",
        createdAt: new Date(),
      }),
      findByToken: vi.fn(),
      update: vi.fn().mockResolvedValue({
        id: "mocked-id",
        userId: "1",
        token: "updated-refresh-token",
        createdAt: new Date(),
      }),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    logoutUseCase = new LogoutUseCase(refreshTokenRepositoryMock);
  });

  it("should be able to logout", async () => {
    refreshTokenRepositoryMock.findByToken.mockResolvedValueOnce({
      id: "mocked-id",
      userId: "1",
      token: "refresh_token",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {} as any
    });
    await logoutUseCase.execute({ refreshToken: "refresh_token" });

    expect(refreshTokenRepositoryMock.findByToken).toHaveBeenCalledWith("refresh_token");
    expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith("mocked-id");
  });

  it("should throw an error if refresh token is not found", async () => {
    refreshTokenRepositoryMock.findByToken.mockResolvedValueOnce(null);

    await expect(logoutUseCase.execute({ refreshToken: "invalid_token" })).rejects.toBeInstanceOf(UnauthorizedError);
    expect(refreshTokenRepositoryMock.delete).not.toHaveBeenCalled();
  });
});