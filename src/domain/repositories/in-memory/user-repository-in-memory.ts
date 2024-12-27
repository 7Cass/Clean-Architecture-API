import { randomUUID } from "node:crypto";
import { IUserRepository } from "../../../interfaces/repositories/user-repository";
import { User } from "../../entities/user";

export class UserRepositoryInMemory implements IUserRepository {
  private users: User[] = [];

  async list(): Promise<User[]> {
    return this.users;
  }

  async create(user: Pick<User, "name" | "password" | "email">): Promise<User> {
    const newUser: User = {
      id: randomUUID(),
      books: [],
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }
}