import { randomUUID } from "node:crypto";
import { UnauthorizedError } from "../../../domain/errors/unauthorized-error";
import { MongoRefreshTokenRepository } from "../../../domain/repositories/mongodb/refresh-token-repository";
import jwt from "jsonwebtoken";

interface LogoutInput {
  refreshToken: string;
}

export class LogoutUseCase {
  constructor(
    private refreshTokenRepository: MongoRefreshTokenRepository
  ) { }

  async execute({ refreshToken }: LogoutInput) {
    // Verifica se o refresh token existe no banco de dados
    const token = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!token) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    // Exclui o refresh token do banco de dados
    await this.refreshTokenRepository.delete(token.id);
  }
}