import { User } from "./user";

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  user: User;
  createdAt: Date;
  expiresAt: Date;
}