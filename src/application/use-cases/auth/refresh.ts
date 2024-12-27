import { randomUUID } from "node:crypto";
import { UnauthorizedError } from "../../../domain/errors/unauthorized-error";
import { MongoRefreshTokenRepository } from "../../../domain/repositories/mongodb/refresh-token-repository";
import jwt from "jsonwebtoken";

interface RefreshTokenInput {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: MongoRefreshTokenRepository
  ) { }

  async execute({ refreshToken }: RefreshTokenInput) {
    const existingToken = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!existingToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    if (existingToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token expired.");
    }

    // Gera um novo JWT
    const newToken = jwt.sign({ sub: existingToken.userId }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    // Gera um novo refresh token
    const newRefreshToken = randomUUID();
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: existingToken.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    });

    // Remove o antigo refresh token
    await this.refreshTokenRepository.delete(existingToken.id);

    return { token: newToken, newRefreshToken };
  }
}