import { RefreshToken } from "../../entities/refresh-token";
import { IRefreshTokenRepository } from "../../../interfaces/repositories/refresh-token-repository";
import { Prisma } from "@prisma/client";

export class RefreshTokenRepositoryInMemory implements IRefreshTokenRepository {
  private refreshTokens: RefreshToken[] = [];

  async create(data: Omit<RefreshToken, "id" | "user" | "createdAt">): Promise<RefreshToken> {
    throw new Error("Method not implemented.");
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    throw new Error("Method not implemented.");
  }

  async update(id: string, data: Prisma.RefreshTokenUpdateInput): Promise<RefreshToken> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}