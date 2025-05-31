import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '@/types';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export function registerAuthHandlers(app: FastifyTypedInstance): void {
  // Authentication middleware
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
        isAdmin: boolean;
      };

      request.user = decoded;
      
    } catch (err) {
      app.log.error('Authentication error: ' + err);
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication failed',
      });
    }
  });

  // Admin authorization middleware
  app.decorate('isAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        throw new Error('User not authenticated');
      }

      if (!request.user.isAdmin) {
        throw new Error('Admin privileges required');
      }
    } catch (err) {
      app.log.error('Admin authorization error: ' + err);
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Admin privileges required',
      });
    }
  });
}
