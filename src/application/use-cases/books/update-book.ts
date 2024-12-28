import { NotFoundError } from "../../../domain/errors/not-found-error";
import { MongoBookRepository } from "../../../domain/repositories/mongodb/book-repository";
import { MongoUserRepository } from "../../../domain/repositories/mongodb/user-repository";

interface UpdateBookInput {
  title?: string;
  description?: string;
  author?: string;
  userId?: string;
};

export class UpdateBookUseCase {
  constructor(
    private bookRepository: MongoBookRepository,
    private userRepository: MongoUserRepository
  ) { }

  async execute(bookId: string, data: UpdateBookInput) {
    const bookExists = await this.bookRepository.findById(bookId);

    if (!bookExists) {
      throw new NotFoundError("Book not found.");
    }

    if (data.userId) {
      const userExists = await this.userRepository.findById(data.userId);

      if (!userExists) {
        throw new NotFoundError("User not found.");
      }
    }

    return await this.bookRepository.update(bookId, data);
  }
}