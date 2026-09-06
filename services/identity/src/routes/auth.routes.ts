import { FastifyInstance } from "fastify"
import { z } from "zod"
import { loginUser } from "../services/auth.service.js"
import { requireAuth } from "../middleware/auth.js"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/v1/auth/login
  fastify.post("/login", async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: parseResult.error.flatten(),
      })
    }

    try {
      const result = await loginUser(parseResult.data, request.ip, request.headers["user-agent"])
      return reply.send({ data: result })
    } catch (err: any) {
      return reply.status(401).send({
        error: err.message || "Invalid credentials",
        code: "AUTH_FAILED",
        statusCode: 401,
      })
    }
  })

  // GET /api/v1/auth/me
  fastify.get("/me", { preHandler: [requireAuth] }, async (request, reply) => {
    return reply.send({ data: request.user })
  })

  // POST /api/v1/auth/logout
  fastify.post("/logout", { preHandler: [requireAuth] }, async (_request, reply) => {
    return reply.send({ data: { message: "Logged out successfully" } })
  })
}
