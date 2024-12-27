import { BookRepositoryInMemory } from "../../domain/repositories/in-memory/book-repository-in-memory";
import { RefreshTokenRepositoryInMemory } from "../../domain/repositories/in-memory/refresh-token-repository-in-memory";
import { UserRepositoryInMemory } from "../../domain/repositories/in-memory/user-repository-in-memory";
import { MongoBookRepository } from "../../domain/repositories/mongodb/book-repository";
import { MongoRefreshTokenRepository } from "../../domain/repositories/mongodb/refresh-token-repository";
import { MongoUserRepository } from "../../domain/repositories/mongodb/user-repository";

export class RepositoryFactory {
  static getUserRepository(): MongoUserRepository {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
      return new MongoUserRepository();
    }
    return new UserRepositoryInMemory();
  }

  static getBookRepository(): MongoBookRepository {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
      return new MongoBookRepository();
    }
    return new BookRepositoryInMemory();
  }

  static getRefreshTokenRepository(): MongoRefreshTokenRepository {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
      return new MongoRefreshTokenRepository();
    }
    return new RefreshTokenRepositoryInMemory();
  }
}