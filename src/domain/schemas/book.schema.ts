import z from "zod";

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  userId: z.string().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
  }).nullable()
});

export const booksSchema = z.array(bookSchema);

export const createBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
});

export const updateBookSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  userId: z.string().optional(),
});