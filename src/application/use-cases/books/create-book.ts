import { ConflictError } from "../../../domain/errors/conflict-error";
import { MongoBookRepository } from "../../../domain/repositories/mongodb/book-repository";

interface CreateBookInput {
  title: string;
  description: string;
  author: string;
};

export class CreateBookUseCase {
  constructor(private bookRepository: MongoBookRepository) { }

  async execute(data: CreateBookInput) {
    const bookExists = await this.bookRepository.findByTitle(data.title);

    if (bookExists) {
      throw new ConflictError("Book already exists.");
    }

    return await this.bookRepository.create(data);
  }
}