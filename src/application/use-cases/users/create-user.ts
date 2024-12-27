import bcrypt from "bcrypt";
import { ConflictError } from "../../../domain/errors/conflict-error";
import { MongoUserRepository } from "../../../domain/repositories/mongodb/user-repository";

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

    const passwordHash = await bcrypt.hash(data.password, 8);
    data.password = passwordHash;

    const user = await this.userRepository.create(data);
    return user;
  }
}