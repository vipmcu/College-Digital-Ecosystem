import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireAuth } from "../middleware/auth.js"

const petitionSchema = z.object({
  petitionType: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().optional(),
})

export async function petitionRoutes(fastify: FastifyInstance) {
  // GET /api/v1/petitions/my
  fastify.get("/my", { preHandler: [requireAuth] }, async (request, reply) => {
    const student = await prisma.student.findUnique({ where: { userId: request.user!.id } })
    if (!student) {
      return reply.status(404).send({ error: "Student profile not found", code: "NOT_FOUND", statusCode: 404 })
    }

    const petitions = await prisma.petition.findMany({
      where: { studentId: student.id, deletedAt: null },
      include: { workflow: { include: { steps: true } } },
      orderBy: { submittedAt: "desc" },
    })

    return reply.send({ data: petitions })
  })

  // POST /api/v1/petitions
  fastify.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const parseResult = petitionSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed", code: "VALIDATION_ERROR", statusCode: 400 })
    }

    const student = await prisma.student.findUnique({ where: { userId: request.user!.id } })
    if (!student) {
      return reply.status(400).send({ error: "Only students can submit academic petitions", code: "FORBIDDEN", statusCode: 400 })
    }

    const petition = await prisma.petition.create({
      data: {
        studentId: student.id,
        petitionType: parseResult.data.petitionType,
        subject: parseResult.data.subject,
        description: parseResult.data.description,
        status: "pending",
        createdBy: request.user!.id,
      },
    })

    return reply.status(201).send({ data: petition })
  })
}
