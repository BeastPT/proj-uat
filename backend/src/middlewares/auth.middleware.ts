import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '@/types';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export function registerAuthHandlers(app: FastifyTypedInstance): void {
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new Error('No authorization header provided');
      }
      
      // Check if it's a Bearer token
      const [scheme, token] = authHeader.split(' ');
      
      if (scheme !== 'Bearer' || !token) {
        throw new Error('Invalid authorization format');
      }
      
      const decoded = verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };

      request.user = decoded;
      
    } catch (err) {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication failed',
      });

      app.log.error('Authentication error: ' + err);
    }
  });
}
