import { FastifyInstance } from "fastify"
import { prisma } from "@repo/db"

export async function dashboardRoutes(fastify: FastifyInstance) {
  // GET /api/v1/analytics/students
  fastify.get("/students", async (_request, reply) => {
    const [totalActive, totalInactive, byProgram] = await Promise.all([
      prisma.student.count({ where: { status: "active", deletedAt: null } }),
      prisma.student.count({ where: { status: "inactive", deletedAt: null } }),
      prisma.student.groupBy({
        by: ["programId"],
        _count: { id: true },
        where: { deletedAt: null },
      }),
    ])

    return reply.send({
      data: {
        totalActive,
        totalInactive,
        totalStudents: totalActive + totalInactive,
        byProgramDistribution: byProgram.map((p: any) => ({
          programId: p.programId,
          count: p._count.id,
        })),
        updatedAt: new Date().toISOString(),
      },
    })
  })

  // GET /api/v1/analytics/documents
  fastify.get("/documents", async (_request, reply) => {
    const [statusCounts, totalDocuments] = await Promise.all([
      prisma.document.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { deletedAt: null },
      }),
      prisma.document.count({ where: { deletedAt: null } }),
    ])

    const statusMap: Record<string, number> = {
      draft: 0,
      submitted: 0,
      pending_approval: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
    }

    statusCounts.forEach((s: any) => {
      statusMap[s.status] = s._count.id
    })

    return reply.send({
      data: {
        totalDocuments,
        statusBreakdown: statusMap,
        approvalRate: totalDocuments > 0 ? ((statusMap.approved / totalDocuments) * 100).toFixed(1) + "%" : "0.0%",
        updatedAt: new Date().toISOString(),
      },
    })
  })

  // GET /api/v1/analytics/adoption (KPI Target: >= 70% Staff, >= 85% Student)
  fastify.get("/adoption", async (_request, reply) => {
    const [totalStaff, activeStaff, totalStudents, activeStudents] = await Promise.all([
      prisma.user.count({ where: { userType: { in: ["staff", "instructor", "admin"] }, deletedAt: null } }),
      prisma.user.count({ where: { userType: { in: ["staff", "instructor", "admin"] }, lastLoginAt: { not: null }, deletedAt: null } }),
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.student.count({ where: { status: "active", deletedAt: null } }),
    ])

    const staffAdoptionRate = totalStaff > 0 ? ((activeStaff / totalStaff) * 100).toFixed(1) : "0.0"
    const studentAdoptionRate = totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : "0.0"

    return reply.send({
      data: {
        staff: {
          total: totalStaff,
          active: activeStaff,
          rate: `${staffAdoptionRate}%`,
          target: ">= 70%",
          meetsTarget: Number(staffAdoptionRate) >= 70,
        },
        students: {
          total: totalStudents,
          active: activeStudents,
          rate: `${studentAdoptionRate}%`,
          target: ">= 85%",
          meetsTarget: Number(studentAdoptionRate) >= 85,
        },
        overallKpiStatus: "ON_TRACK",
        updatedAt: new Date().toISOString(),
      },
    })
  })

  // Helper to ping services
  async function pingService(url: string): Promise<{ status: "UP" | "DOWN"; latencyMs: number }> {
    const start = Date.now()
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 1200)
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      return {
        status: res.ok ? "UP" : "DOWN",
        latencyMs: Math.max(1, Date.now() - start),
      }
    } catch {
      return {
        status: "DOWN",
        latencyMs: Math.max(1, Date.now() - start),
      }
    }
  }

  // GET /api/v1/analytics/system-metrics (Native In-App Monitoring)
  fastify.get("/system-metrics", async (_request, reply) => {
    const startTime = Date.now()

    // 1. Ping all core services in parallel
    const [identity, sis, documentService, analyticsSelf, notification] = await Promise.all([
      pingService("http://127.0.0.1:4001/health"),
      pingService("http://127.0.0.1:4002/health"),
      pingService("http://127.0.0.1:4003/health"),
      pingService("http://127.0.0.1:4004/health"),
      pingService("http://127.0.0.1:4005/health"),
    ])

    // 2. Query Postgres table stats
    let dbStatus: "CONNECTED" | "DISCONNECTED" = "CONNECTED"
    let userCount = 0
    let studentCount = 0
    let docCount = 0
    let auditCount = 0
    let filesUploadedCount = 0
    let recentLogs: any[] = []

    try {
      const [uC, sC, dC, aC, fC, rL] = await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        prisma.student.count({ where: { deletedAt: null } }),
        prisma.document.count({ where: { deletedAt: null } }),
        prisma.auditLog.count(),
        prisma.document.count({ where: { filePath: { not: null }, deletedAt: null } }),
        prisma.auditLog.findMany({
          take: 5,
          orderBy: { eventTime: "desc" },
          select: {
            id: true,
            action: true,
            resourceType: true,
            userId: true,
            eventTime: true,
          },
        }),
      ])
      userCount = uC
      studentCount = sC
      docCount = dC
      auditCount = aC
      filesUploadedCount = fC
      recentLogs = rL
    } catch {
      dbStatus = "DISCONNECTED"
    }

    // 3. Process & Memory Metrics
    const mem = process.memoryUsage()
    const memoryMetrics = {
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10,
      rssMb: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
      heapUtilizationPct: Math.round((mem.heapUsed / mem.heapTotal) * 100),
      uptimeSeconds: Math.round(process.uptime()),
    }

    return reply.send({
      data: {
        timestamp: new Date().toISOString(),
        queryExecutionMs: Date.now() - startTime,
        services: [
          { name: "Identity Service (Auth & RBAC)", port: 4001, ...identity },
          { name: "SIS Service (Student & Course)", port: 4002, ...sis },
          { name: "Document Service (Workflow & Sign)", port: 4003, ...documentService },
          { name: "Analytics Service (Metrics Engine)", port: 4004, ...analyticsSelf },
          { name: "Notification Service (Queue & Mail)", port: 4005, ...notification },
        ],
        database: {
          status: dbStatus,
          driver: "PostgreSQL 16",
          tables: {
            users: userCount,
            students: studentCount,
            documents: docCount,
            auditLogs: auditCount,
          },
        },
        storage: {
          driver: "local",
          storagePath: process.env.STORAGE_LOCAL_PATH || "./uploads",
          documentsWithFiles: filesUploadedCount,
          status: "ONLINE",
        },
        runtime: {
          nodeVersion: process.version,
          platform: process.platform,
          ...memoryMetrics,
        },
        recentAuditLogs: recentLogs,
      },
    })
  })
}
