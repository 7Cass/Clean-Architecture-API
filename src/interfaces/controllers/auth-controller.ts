import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUseCase } from "../../application/use-cases/auth/login";
import z from "zod";
import { UnauthorizedError } from "../../domain/errors/unauthorized-error";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh";
import { LogoutUseCase } from "../../application/use-cases/auth/logout";

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type LoginUserBody = z.infer<typeof loginUserBodySchema>;

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase
  ) { }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { accessToken, refreshToken } = await this.loginUseCase.execute(request.body as LoginUserBody);

      reply
        .setCookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60, // 15 minutos
        })
        .setCookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
        });

      return reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refresh_token } = request.cookies as { refresh_token: string };
      console.log(request.cookies);

      if (!refresh_token) {
        throw new UnauthorizedError("Refresh token not provided.");
      }
      const { token, newRefreshToken } = await this.refreshTokenUseCase.execute({ refreshToken: refresh_token });

      // Configura os cookies
      reply
        .setCookie('access_token', token, {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60, // 15 minutos
        })
        .setCookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 dias
        });

      reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refresh_token } = request.cookies as { refresh_token: string };

      if (!refresh_token) {
        throw new UnauthorizedError("Refresh token not provided.");
      }

      await this.logoutUseCase.execute({ refreshToken: refresh_token });

      // Remove o cookie de refresh token
      reply
        .clearCookie('refresh_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'strict'
        })
        .clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'strict'
        });

      reply.status(204).send();
    } catch (error) {
      throw error;
    }
  }
}