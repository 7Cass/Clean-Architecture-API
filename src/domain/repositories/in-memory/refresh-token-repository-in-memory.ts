import { RefreshToken } from "../../entities/refresh-token";
import { IRefreshTokenRepository } from "../../../interfaces/repositories/refresh-token-repository";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { User } from "../../entities/user";

export class RefreshTokenRepositoryInMemory implements IRefreshTokenRepository {
  private refreshTokens: RefreshToken[] = [];

  async create(data: Omit<RefreshToken, "id" | "user" | "createdAt"> & { user: User }): Promise<RefreshToken> {
    const refreshToken = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data
    };
    this.refreshTokens.push(refreshToken);
    return refreshToken;
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