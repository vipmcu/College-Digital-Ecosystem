import { FastifyInstance } from "fastify"
import { prisma } from "@repo/db"
import { requireRole } from "../middleware/auth.js"

export async function auditRoutes(fastify: FastifyInstance) {
  // GET /api/v1/audit-logs (DPO, IT Admin, Executive only)
  fastify.get("/", { preHandler: [requireRole(["dpo", "it_admin", "executive"])] }, async (request, reply) => {
    const query = request.query as any
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
    const skip = (page - 1) * limit

    const where: any = {}
    if (query.action) where.action = query.action
    if (query.userId) where.userId = query.userId
    if (query.resourceType) where.resourceType = query.resourceType

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { eventTime: "desc" },
      }),
    ])

    return reply.send({
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  })
}
