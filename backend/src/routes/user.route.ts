import { FastifyTypedInstance } from "@/types";
import { z } from "zod";

export default async function (app: FastifyTypedInstance) {
  app.register(
    async (router: FastifyTypedInstance) => {
      router.get("/", async (_request, reply) => {
        reply.send({ message: "User route" });
      });

      // Register a new user
      router.post(
        "/register",
        {
          schema: {
            tags: ["user"],
            body: z.object({
              name: z.string().min(1).max(50),
              email: z.string().email(),
              password: z.string().min(8).max(50),
            }),
            response: {
              201: z.object({ message: z.string() }),
            },
          },
        },
        (req, reply) => {}
      );

      // Login
      router.post(
        "/login",
        {
          schema: {
            tags: ["user"],
            body: z.object({
              email: z.string().email(),
              password: z.string().min(8).max(50),
            }),
            response: {
              200: z.object({ token: z.string(), refreshToken: z.string() }),
            },
          },
        },
        (req, reply) => {}
      );

      // Get all users (admin)
      router.get(
        "/all",
        {
          schema: {
            tags: ["user"],
            response: {
              200: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  email: z.string().email(),
                })
              ),
            },
          },
        },
        (req, reply) => {}
      );

      // Get specific user by ID (admin)
      router.get(
        "/:id",
        {
          schema: {
            tags: ["user"],
            params: z.object({ id: z.string().uuid() }),
            response: {
              200: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string().email(),
              }),
            },
          },
        },
        (req, reply) => {}
      );

      // Update user by ID
      router.put(
        "/:id",
        {
          schema: {
            tags: ["user"],
            params: z.object({ id: z.string().uuid() }),
            body: z.object({
              name: z.string().min(1).max(50).optional(),
              email: z.string().email().optional(),
              password: z.string().min(8).max(50).optional(),
            }),
            response: {
              200: z.object({ message: z.string() }),
            },
          },
        },
        (req, reply) => {}
      );

      // Delete user by ID
      router.delete(
        "/:id",
        {
          schema: {
            tags: ["user"],
            params: z.object({ id: z.string().uuid() }),
            response: {
              204: z.undefined(),
            },
          },
        },
        (req, reply) => {}
      );

      // Get current user profile (requires auth)
      router.get(
        "/profile",
        {
          schema: {
            tags: ["user"],
            response: {
              200: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string().email(),
              }),
            },
          },
          // preHandler: [app.authenticate], // Uncomment if you have an auth hook
        },
        (req, reply) => {}
      );
    },
    { prefix: "/user" }
  );
}
