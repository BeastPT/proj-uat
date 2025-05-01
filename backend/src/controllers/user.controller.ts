import { FastifyReply, FastifyRequest } from "fastify";

export function Register(request: FastifyRequest, reply: FastifyReply) {
  reply.send({ message: 'User registered successfully' });
}