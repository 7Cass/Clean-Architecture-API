import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../../domain/errors/unauthorized-error";
import { MongoUserRepository } from "../../../domain/repositories/mongodb/user-repository";
import { MongoRefreshTokenRepository } from "../../../domain/repositories/mongodb/refresh-token-repository";
import { randomUUID } from "node:crypto";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: MongoUserRepository,
    private refreshTokenRepository: MongoRefreshTokenRepository
  ) { }

  async execute(data: LoginUserInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Email or password invalid.");
    }

    const passwordMatch = bcrypt.compareSync(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedError("Email or password invalid.");
    }

    const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "15min",
    });

    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt
    });

    return { accessToken, refreshToken };
  }
}