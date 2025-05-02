import { FastifyServerOptions } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export interface AppConfig {
  server: FastifyServerOptions;
  cors: {
    origin: string | string[];
  };
  swagger: {
    routePrefix: string;
    title: string;
    version: string;
  };
  api: {
    prefix: string;
  };
  port: number;
}

export const appConfig: AppConfig = {
  server: { 
    logger: true 
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  swagger: {
    routePrefix: '/docs',
    title: 'UAT API',
    version: '1.0.0',
  },
  api: {
    prefix: '/api',
  },
  port: parseInt(process.env.PORT || '3000', 10),
};