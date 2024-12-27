import { MongoBookRepository } from "../../../domain/repositories/mongodb/book-repository";

export class ListBooksUseCase {
  constructor(private bookRepository: MongoBookRepository) { }

  async execute() {
    return await this.bookRepository.list();
  }
}