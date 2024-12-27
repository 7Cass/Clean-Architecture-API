import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "../../../types/fastify/fastify-instance";
import { AppError } from "../../../domain/errors/app-error";

export function setupErrorHandler(app: FastifyTypedInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.name, message: error.message });
      return;
    }

    if (error.validation) {
      reply.status(error.statusCode!).send({ message: error.validation });
      return;
    }

    console.error("Unhandled Error: ", error);
    reply.status(500).send({ message: "Internal Server Error" });
  });
}