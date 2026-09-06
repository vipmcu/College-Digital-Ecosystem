import path from "path"
import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireAuth } from "../middleware/auth.js"
import { createDocumentWithWorkflow, submitDocument, signDocument } from "../services/workflow.service.js"
import { localStorageService } from "../services/local-storage.service.js"

const createDocSchema = z.object({
  documentTypeId: z.string().uuid(),
  subject: z.string().min(1),
  body: z.string().optional(),
  orgUnitId: z.string().uuid().optional(),
  approvalSteps: z.array(
    z.object({
      stepNumber: z.number().int().positive(),
      stepName: z.string(),
      approverId: z.string().uuid().optional(),
      approverRole: z.string().optional(),
    })
  ).optional(),
})

export async function documentRoutes(fastify: FastifyInstance) {
  // GET /api/v1/documents/types
  fastify.get("/types", async (_request, reply) => {
    const types = await prisma.documentType.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { nameTh: "asc" },
    })
    return reply.send({ data: types })
  })

  // GET /api/v1/documents
  fastify.get("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const query = request.query as any
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
    const skip = (page - 1) * limit

    const where: any = { deletedAt: null }
    if (query.status) where.status = query.status
    if (query.documentTypeId) where.documentTypeId = query.documentTypeId

    const userRoles = request.user?.roles || []
    const isElevated = userRoles.some((r: string) => ["document_officer", "it_admin", "executive"].includes(r))
    if (!isElevated) {
      where.createdByUserId = request.user?.id
    }

    const [total, items] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          documentType: true,
          creator: { select: { id: true, username: true, firstNameTh: true, lastNameTh: true } },
          workflows: { include: { steps: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return reply.send({
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  })

  // POST /api/v1/documents
  fastify.post("/", { preHandler: [requireAuth] }, async (request, reply) => {
    const parseResult = createDocSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: parseResult.error.flatten(),
      })
    }

    try {
      const result = await createDocumentWithWorkflow({
        ...parseResult.data,
        createdByUserId: request.user!.id,
      })
      return reply.status(201).send({ data: result })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to create document", code: "CREATE_DOC_FAILED", statusCode: 400 })
    }
  })

  // GET /api/v1/documents/:id
  fastify.get("/:id", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const doc = await prisma.document.findUnique({
      where: { id, deletedAt: null },
      include: {
        documentType: true,
        creator: { select: { id: true, username: true, firstNameTh: true, lastNameTh: true, email: true } },
        workflows: { include: { steps: { orderBy: { stepNumber: "asc" } } } },
        signatures: true,
      },
    })
    if (!doc) {
      return reply.status(404).send({ error: "Document not found", code: "NOT_FOUND", statusCode: 404 })
    }
    return reply.send({ data: doc })
  })

  // POST /api/v1/documents/:id/submit
  fastify.post("/:id/submit", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      const updated = await submitDocument(id, request.user!.id)
      return reply.send({ data: updated })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "SUBMIT_FAILED", statusCode: 400 })
    }
  })

  // POST /api/v1/documents/:id/sign
  fastify.post("/:id/sign", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      const signature = await signDocument({
        documentId: id,
        signerId: request.user!.id,
        ipAddress: request.ip,
        metadata: { userAgent: request.headers["user-agent"] },
      })
      return reply.send({ data: signature })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "SIGN_FAILED", statusCode: 400 })
    }
  })

  // GET /api/v1/documents/storage/stats
  fastify.get("/storage/stats", { preHandler: [requireAuth] }, async (_request, reply) => {
    const stats = await localStorageService.getStats()
    return reply.send({
      data: {
        driver: "local",
        ...stats,
      },
    })
  })

  // POST /api/v1/documents/:id/upload
  fastify.post("/:id/upload", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const doc = await prisma.document.findUnique({
      where: { id, deletedAt: null },
    })
    if (!doc) {
      return reply.status(404).send({ error: "Document not found", code: "NOT_FOUND", statusCode: 404 })
    }

    const body = request.body as any
    if (!body || !body.fileName || !body.fileBase64) {
      return reply.status(400).send({
        error: "Missing fileName or fileBase64 in request body",
        code: "INVALID_PAYLOAD",
        statusCode: 400,
      })
    }

    try {
      const fileBuffer = Buffer.from(body.fileBase64, "base64")
      const mimeType = body.mimeType || "application/octet-stream"
      const stored = await localStorageService.saveFile(id, body.fileName, fileBuffer, mimeType)

      const updated = await prisma.document.update({
        where: { id },
        data: {
          filePath: stored.filePath,
          fileSizeBytes: BigInt(stored.fileSize),
          mimeType: stored.mimeType,
        },
      })

      return reply.send({
        data: {
          document: updated,
          file: stored,
        },
      })
    } catch (err: any) {
      return reply.status(500).send({ error: err.message, code: "UPLOAD_FAILED", statusCode: 500 })
    }
  })

  // GET /api/v1/documents/:id/download
  fastify.get("/:id/download", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const doc = await prisma.document.findUnique({
      where: { id, deletedAt: null },
    })
    if (!doc || !doc.filePath) {
      return reply.status(404).send({ error: "Document file not found", code: "FILE_NOT_FOUND", statusCode: 404 })
    }

    try {
      const fileBuffer = await localStorageService.readFile(doc.filePath)
      reply.header("Content-Type", doc.mimeType || "application/octet-stream")
      reply.header("Content-Disposition", `attachment; filename="${path.basename(doc.filePath)}"`)
      return reply.send(fileBuffer)
    } catch (err: any) {
      return reply.status(500).send({ error: "Failed to read file from storage", code: "READ_FAILED", statusCode: 500 })
    }
  })
}
