import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserUseCase } from "../../application/use-cases/users/create-user";
import z from "zod";
import { ListUsers } from "../../application/use-cases/users/list-users";

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});
type CreateUserBody = z.infer<typeof createUserBodySchema>;

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUsersUseCase: ListUsers
  ) { }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await this.createUserUseCase.execute(request.body as CreateUserBody);
      reply.status(201).send(user);
    } catch (error) {
      throw error;
    }
  }

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.listUsersUseCase.execute();
      reply.status(200).send(users);
    } catch (error: any) {
      throw error;
    }
  }
}