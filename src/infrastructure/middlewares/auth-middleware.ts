import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../domain/errors/unauthorized-error";
import { verify } from "jsonwebtoken";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedError('Token not provided.');
    }

    const decodedToken = verify(token, process.env.JWT_SECRET as string);

    request.user = {
      userId: decodedToken.sub as string
    };
  } catch (error) {
    throw error;
  }
}