import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { listStudents, createStudentProfile, getStudentById } from "../services/student.service.js"

const createStudentSchema = z.object({
  userId: z.string().uuid(),
  studentCode: z.string().regex(/^[0-9]{10}$/, "Student code must be 10 digits"),
  enrollmentYear: z.number().int().min(2560),
  programId: z.string().uuid().optional(),
  nationalId: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
})

export async function studentRoutes(fastify: FastifyInstance) {
  // GET /api/v1/students
  fastify.get("/", { preHandler: [requireRole(["registrar", "it_admin", "executive"])] }, async (request, reply) => {
    const query = request.query as any
    const result = await listStudents(query)
    return reply.send(result)
  })

  // POST /api/v1/students
  fastify.post("/", { preHandler: [requireRole(["registrar", "it_admin"])] }, async (request, reply) => {
    const parseResult = createStudentSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: parseResult.error.flatten(),
      })
    }

    try {
      const student = await createStudentProfile({
        ...parseResult.data,
        actorId: request.user!.id,
        ipAddress: request.ip,
      })
      return reply.status(201).send({ data: student })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "CREATE_STUDENT_FAILED", statusCode: 400 })
    }
  })

  // GET /api/v1/students/me
  fastify.get("/me", { preHandler: [requireAuth] }, async (request, reply) => {
    const student = await prisma.student.findUnique({
      where: { userId: request.user!.id },
      include: { program: true, user: true },
    })
    if (!student) {
      return reply.status(404).send({ error: "Student profile not found for current user", code: "NOT_FOUND", statusCode: 404 })
    }
    return reply.send({ data: student })
  })

  // GET /api/v1/students/:id
  fastify.get("/:id", { preHandler: [requireRole(["registrar", "it_admin", "dpo"])] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      const student = await getStudentById(id, request.user!.id, request.ip)
      return reply.send({ data: student })
    } catch (err: any) {
      return reply.status(404).send({ error: "Student not found", code: "NOT_FOUND", statusCode: 404 })
    }
  })
}
