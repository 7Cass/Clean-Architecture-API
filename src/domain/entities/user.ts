import { Book } from "./book";

export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  books?: Book[];
}