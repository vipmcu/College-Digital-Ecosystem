import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireRole } from "../middleware/auth.js"

const createSectionSchema = z.object({
  courseId: z.string().uuid(),
  sectionNumber: z.string().min(1),
  academicYear: z.number().int().min(2560),
  semester: z.number().int().min(1).max(3),
  instructorId: z.string().uuid().optional(),
  maxStudents: z.number().int().min(1).default(40),
  room: z.string().optional(),
  schedule: z.any().optional(),
})

export async function academicRoutes(fastify: FastifyInstance) {
  // GET /api/v1/programs
  fastify.get("/programs", async (_request, reply) => {
    const programs = await prisma.program.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { code: "asc" },
    })
    return reply.send({ data: programs })
  })

  // GET /api/v1/courses
  fastify.get("/courses", async (_request, reply) => {
    const courses = await prisma.course.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { code: "asc" },
    })
    return reply.send({ data: courses })
  })

  // GET /api/v1/course-sections
  fastify.get("/course-sections", async (request, reply) => {
    const query = request.query as any
    const where: any = { deletedAt: null }
    if (query.courseId) where.courseId = query.courseId
    if (query.academicYear) where.academicYear = Number(query.academicYear)
    if (query.semester) where.semester = Number(query.semester)

    const sections = await prisma.courseSection.findMany({
      where,
      include: {
        course: true,
        instructor: { select: { id: true, firstNameTh: true, lastNameTh: true, email: true } },
      },
      orderBy: [{ academicYear: "desc" }, { semester: "desc" }, { sectionNumber: "asc" }],
    })
    return reply.send({ data: sections })
  })

  // POST /api/v1/course-sections
  fastify.post("/course-sections", { preHandler: [requireRole(["registrar", "it_admin"])] }, async (request, reply) => {
    const parseResult = createSectionSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed", code: "VALIDATION_ERROR", statusCode: 400 })
    }

    try {
      const section = await prisma.courseSection.create({
        data: {
          ...parseResult.data,
          createdBy: request.user!.id,
        },
      })
      return reply.status(201).send({ data: section })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "CREATE_SECTION_FAILED", statusCode: 400 })
    }
  })
}
