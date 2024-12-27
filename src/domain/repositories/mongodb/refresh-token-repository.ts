import { Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import { IRefreshTokenRepository } from "../../../interfaces/repositories/refresh-token-repository";
import { RefreshToken } from "../../entities/refresh-token";

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: Omit<RefreshToken, "id" | "user" | "createdAt">): Promise<RefreshToken> {
    const refreshToken = await prisma.refreshToken.create({
      data,
      include: { user: true },
    });
    return refreshToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
  }

  async update(id: string, data: Prisma.RefreshTokenUpdateInput): Promise<RefreshToken> {
    return await prisma.refreshToken.update({ where: { id }, data, include: { user: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { id } });
  }
}