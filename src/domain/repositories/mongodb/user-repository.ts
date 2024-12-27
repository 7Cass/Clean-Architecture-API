import prisma from "../../../config/prisma";
import { IUserRepository } from "../../../interfaces/repositories/user-repository";
import { User } from "../../entities/user";

export class MongoUserRepository implements IUserRepository {

  async list(): Promise<User[]> {
    return await prisma.user.findMany({ include: { books: true } });
  }

  async create(user: Pick<User, "name" | "password" | "email">): Promise<User> {
    return await prisma.user.create({ data: user, include: { books: true } });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id }, include: { books: true } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email }, include: { books: true } });
  }
}