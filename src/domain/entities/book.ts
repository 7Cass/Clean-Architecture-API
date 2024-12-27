import { User } from "./user";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  userId?: string | null;
  user?: User | null;
}