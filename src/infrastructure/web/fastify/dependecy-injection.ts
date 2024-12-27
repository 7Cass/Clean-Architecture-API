import fp from "fastify-plugin";
import { CreateUserUseCase } from "../../../application/use-cases/users/create-user";
import { ListUsers } from "../../../application/use-cases/users/list-users";
import { UserController } from "../../../interfaces/controllers/user-controller";
import { FastifyTypedInstance } from "../../../types/fastify/fastify-instance";
import { RepositoryFactory } from "../../factories/repository-factory";
import { AuthController } from "../../../interfaces/controllers/auth-controller";
import { LoginUseCase } from "../../../application/use-cases/auth/login";
import { CreateBookUseCase } from "../../../application/use-cases/books/create-book";
import { BookController } from "../../../interfaces/controllers/book-controller";
import { ListBooksUseCase } from "../../../application/use-cases/books/list-books";
import { UpdateBookUseCase } from "../../../application/use-cases/books/update-book";
import { RefreshTokenUseCase } from "../../../application/use-cases/auth/refresh";
import { LogoutUseCase } from "../../../application/use-cases/auth/logout";

export const dependencyInjection = fp(async (app: FastifyTypedInstance) => {
  // User
  const usersRepository = RepositoryFactory.getUserRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const listUsersUseCase = new ListUsers(usersRepository);
  const userController = new UserController(createUserUseCase, listUsersUseCase);

  // Auth
  const refreshTokenRepository = RepositoryFactory.getRefreshTokenRepository();
  const loginUseCase = new LoginUseCase(usersRepository, refreshTokenRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository);
  const logoutUseCase = new LogoutUseCase(refreshTokenRepository);
  const authController = new AuthController(loginUseCase, refreshTokenUseCase, logoutUseCase);

  // Book
  const bookRepository = RepositoryFactory.getBookRepository();
  const createBookUseCase = new CreateBookUseCase(bookRepository);
  const listBooksUseCase = new ListBooksUseCase(bookRepository);
  const updateBookUseCase = new UpdateBookUseCase(bookRepository, usersRepository);
  const bookController = new BookController(createBookUseCase, listBooksUseCase, updateBookUseCase);

  app.decorate('userController', userController);
  app.decorate('authController', authController);
  app.decorate('bookController', bookController);
});