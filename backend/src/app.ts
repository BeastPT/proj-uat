import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import autoload from '@fastify/autoload';
import path from 'node:path';

import { appConfig } from './config/app.config';
import { registerErrorHandlers } from './middlewares/error.middleware';
import { registerAuthHandlers } from './middlewares/auth.middleware';

export async function createApp() {
  // Create Fastify instance with ZodTypeProvider
  const app = fastify(appConfig.server).withTypeProvider<ZodTypeProvider>();

  // Set up validator and serializer compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register CORS
  await app.register(fastifyCors, appConfig.cors);

  // Register Swagger
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: appConfig.swagger.title,
        version: appConfig.swagger.version,
      },
    },
    transform: jsonSchemaTransform,
  });

  // Register Swagger UI
  await app.register(fastifySwaggerUi, {
    routePrefix: appConfig.swagger.routePrefix,
  });

  // Register error handlers
  registerErrorHandlers(app);

  // Register authentication handlers
  registerAuthHandlers(app);

  // Register routes
  await app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options: {
      prefix: appConfig.api.prefix,
    },
  });

  // Root route
  app.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  return app;
}