import { MongoUserRepository } from "../../../domain/repositories/mongodb/user-repository";

export class ListUsers {
  constructor(private userRepository: MongoUserRepository) { }

  async execute() {
    return await this.userRepository.list();
  }
}