import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { enrollSection, withdrawSection, submitGrade, calculateStudentTranscript } from "../services/enrollment.service.js"

const enrollSchema = z.object({
  sectionId: z.string().uuid(),
  studentId: z.string().uuid().optional(),
})

const gradeSchema = z.object({
  grade: z.string().min(1).max(2),
})

export async function enrollmentRoutes(fastify: FastifyInstance) {
  // POST /api/v1/enrollments
  fastify.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const parseResult = enrollSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed", code: "VALIDATION_ERROR", statusCode: 400 })
    }

    let targetStudentId: string
    if (parseResult.data.studentId) {
      targetStudentId = parseResult.data.studentId
    } else {
      const student = await prisma.student.findUnique({ where: { userId: request.user!.id } })
      if (!student) return reply.status(400).send({ error: "No student profile for this user", code: "NO_STUDENT", statusCode: 400 })
      targetStudentId = student.id
    }

    try {
      const enrollment = await enrollSection({
        studentId: targetStudentId,
        sectionId: parseResult.data.sectionId,
        actorId: request.user!.id,
      })
      return reply.status(201).send({ data: enrollment })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "ENROLL_FAILED", statusCode: 400 })
    }
  })

  // DELETE /api/v1/enrollments/:id
  fastify.delete("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      const result = await withdrawSection({
        enrollmentId: id,
        actorId: request.user!.id,
      })
      return reply.send({ data: result })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "WITHDRAW_FAILED", statusCode: 400 })
    }
  })

  // POST /api/v1/enrollments/:id/grade
  fastify.post("/:id/grade", { preHandler: [requireRole(["instructor", "registrar", "it_admin"])] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const parseResult = gradeSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Invalid grade", code: "VALIDATION_ERROR", statusCode: 400 })
    }

    try {
      const result = await submitGrade({
        enrollmentId: id,
        grade: parseResult.data.grade,
        actorId: request.user!.id,
      })
      return reply.send({ data: result })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "GRADE_SUBMIT_FAILED", statusCode: 400 })
    }
  })

  // GET /api/v1/enrollments/my-transcript
  fastify.get("/my-transcript", { preHandler: [requireAuth] }, async (request, reply) => {
    const student = await prisma.student.findUnique({ where: { userId: request.user!.id } })
    if (!student) {
      return reply.status(404).send({ error: "Student record not found", code: "NOT_FOUND", statusCode: 404 })
    }

    const transcript = await calculateStudentTranscript(student.id)
    return reply.send({ data: transcript })
  })
}
