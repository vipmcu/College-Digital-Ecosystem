import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "@repo/db"
import { requireAuth } from "../middleware/auth.js"
import { processApprovalStep } from "../services/workflow.service.js"

const actionSchema = z.object({
  action: z.enum(["approved", "rejected"]),
  comment: z.string().optional(),
})

export async function workflowRoutes(fastify: FastifyInstance) {
  // GET /api/v1/workflows/pending (Tasks waiting for caller)
  fastify.get("/pending", { preHandler: [requireAuth] }, async (request, reply) => {
    const userRoles = request.user?.roles || []
    const userId = request.user?.id

    const pendingSteps = await prisma.workflowStep.findMany({
      where: {
        status: "pending",
        OR: [
          { approverId: userId },
          { approverRole: { in: userRoles } },
        ],
        workflow: {
          status: "active",
        },
      },
      include: {
        workflow: {
          include: {
            document: {
              include: {
                creator: { select: { id: true, firstNameTh: true, lastNameTh: true, email: true } },
                documentType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return reply.send({ data: pendingSteps })
  })

  // POST /api/v1/workflows/:id/steps/:stepNumber/action
  fastify.post("/:id/steps/:stepNumber/action", { preHandler: [requireAuth] }, async (request, reply) => {
    const { id, stepNumber } = request.params as { id: string; stepNumber: string }
    const parseResult = actionSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Validation failed", code: "VALIDATION_ERROR", statusCode: 400 })
    }

    try {
      const result = await processApprovalStep({
        workflowId: id,
        stepNumber: Number(stepNumber),
        actorId: request.user!.id,
        action: parseResult.data.action,
        comment: parseResult.data.comment,
      })
      return reply.send({ data: result })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message, code: "WORKFLOW_ACTION_FAILED", statusCode: 400 })
    }
  })
}
