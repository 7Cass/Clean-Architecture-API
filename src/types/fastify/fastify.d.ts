import { AuthController } from "../../interfaces/controllers/auth-controller";
import { BookController } from "../../interfaces/controllers/book-controller";
import { UserController } from "../../interfaces/controllers/user-controller";

declare module "fastify" {
  interface FastifyInstance {
    userController: UserController;
    authController: AuthController;
    bookController: BookController;
  }

  interface FastifyRequest {
    user?: { userId: string };
  }
}