import { Register } from "@/controllers/user.controller";
import { FastifyTypedInstance } from "@/types";
import z from "zod";

export default async function(app: FastifyTypedInstance) {
  app.register(async (router: FastifyTypedInstance) => {
    
    router.get('/', async (request, reply) => {
      reply.send({ message: 'User route' });
    });

    router.post('/register', {
      schema: {
        tags: ['user'],
        body: z.object({
          name: z.string().min(1).max(50),
          email: z.string().email(),
          password: z.string().min(8).max(50),
        }),
        
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    }, Register);

  }, { prefix: '/user' });
}