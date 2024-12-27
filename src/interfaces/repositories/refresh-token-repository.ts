import { Prisma } from "@prisma/client";
import { RefreshToken } from "../../domain/entities/refresh-token";

export interface IRefreshTokenRepository {
  create(data: Omit<RefreshToken, "id" | "user" | "createdAt">): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  update(id: string, data: Prisma.RefreshTokenUpdateInput): Promise<RefreshToken>;
  delete(id: string): Promise<void>;
}