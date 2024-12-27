import { User } from "../../domain/entities/user";

export interface IUserRepository {
  list(): Promise<User[]>;
  create(user: Pick<User, 'name' | 'password' | 'email'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}