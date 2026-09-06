import { FastifyInstance } from "fastify"
import { z } from "zod"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { listUsers, createUser, updateUser, bulkImportUsers } from "../services/user.service.js"

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  firstNameTh: z.string().min(1),
  lastNameTh: z.string().min(1),
  firstNameEn: z.string().optional(),
  lastNameEn: z.string().optional(),
  userType: z.enum(["student", "staff", "instructor", "admin"]),
  orgUnitId: z.string().uuid().optional(),
  roles: z.array(z.enum(["student", "instructor", "registrar", "document_officer", "executive", "it_admin", "dpo"])),
})

export async function userRoutes(fastify: FastifyInstance) {
  // GET /api/v1/users
  fastify.get("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const query = request.query as any
    const result = await listUsers(query)
    return reply.send(result)
  })

  // POST /api/v1/users
  fastify.post("/", { preHandler: [requireRole(["it_admin", "registrar"])] }, async (request, reply) => {
    const parseResult = createUserSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: parseResult.error.flatten(),
      })
    }

    try {
      const user = await createUser(parseResult.data as any, request.user!.id, request.ip)
      return reply.status(201).send({ data: user })
    } catch (err: any) {
      return reply.status(400).send({
        error: err.message || "Failed to create user",
        code: "USER_CREATE_FAILED",
        statusCode: 400,
      })
    }
  })

  // POST /api/v1/users/bulk-import
  fastify.post("/bulk-import", { preHandler: [requireRole(["it_admin", "registrar"])] }, async (request, reply) => {
    const rows = request.body as any[]
    if (!Array.isArray(rows) || rows.length === 0) {
      return reply.status(400).send({ error: "Expected an array of user rows", code: "INVALID_BODY", statusCode: 400 })
    }

    const result = await bulkImportUsers(rows, request.user!.id, request.ip)
    return reply.send({ data: result })
  })

  // PATCH /api/v1/users/:id
  fastify.patch("/:id", { preHandler: [requireRole(["it_admin"])] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const user = await updateUser(id, request.body as any, request.user!.id, request.ip)
    return reply.send({ data: user })
  })
}
