import bcrypt from "bcrypt";
import { ConflictError } from "../../../domain/errors/conflict-error";
import { MongoUserRepository } from "../../../domain/repositories/mongodb/user-repository";
import { BadRequestError } from "../../../domain/errors/bad-request-error";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: MongoUserRepository) { }

  async execute(data: CreateUserInput) {
    const emailExists = await this.userRepository.findByEmail(data.email);

    if (emailExists) {
      throw new ConflictError("Email already exists");
    }

    if (data.password.length < 8) {
      throw new BadRequestError("Password must have at least 8 characters");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    data.password = passwordHash;

    const user = await this.userRepository.create(data);
    return user;
  }
}