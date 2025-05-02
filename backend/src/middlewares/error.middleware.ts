import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '@/types';
import { ZodError } from 'zod';

export function registerErrorHandlers(app: FastifyTypedInstance): void {
  // Handle Not Found errors
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  // Handle validation errors
  app.setErrorHandler((error: FastifyError, request, reply) => {
    app.log.error(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation error',
        errors: error.errors,
      });
    }

    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation error',
        errors: error.validation,
      });
    }

    // Handle custom status code errors
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    // Handle all other errors
    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    });
  });
}