import z from "zod";

export const userSchema = z.object({ // @TODO: Criar um schema para user
  id: z.string(),
  name: z.string(),
  email: z.string(),
  books: z.array(z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string(),
    userId: z.string().nullable()
  }))
});

export const usersSchema = z.array(userSchema);