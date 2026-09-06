import Fastify, { FastifyRequest, FastifyReply } from "fastify"
import cors from "@fastify/cors"
import rateLimit from "@fastify/rate-limit"
import { RATE_LIMIT_PER_IP } from "@repo/utils"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// Service URL mapping from architecture.md
const SERVICES: Record<string, string> = {
  auth: process.env.IDENTITY_SERVICE_URL || "http://localhost:4001",
  users: process.env.IDENTITY_SERVICE_URL || "http://localhost:4001",
  "audit-logs": process.env.IDENTITY_SERVICE_URL || "http://localhost:4001",
  students: process.env.SIS_SERVICE_URL || "http://localhost:4002",
  academic: process.env.SIS_SERVICE_URL || "http://localhost:4002",
  enrollments: process.env.SIS_SERVICE_URL || "http://localhost:4002",
  petitions: process.env.SIS_SERVICE_URL || "http://localhost:4002",
  documents: process.env.DOCUMENT_SERVICE_URL || "http://localhost:4003",
  workflows: process.env.DOCUMENT_SERVICE_URL || "http://localhost:4003",
  analytics: process.env.ANALYTICS_SERVICE_URL || "http://localhost:4004",
}

// Health check endpoint
fastify.get("/health", async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
    version: "1.0.0",
  }
})

// API metadata endpoint
fastify.get("/api/v1", async () => {
  return {
    message: "College Digital Ecosystem API Gateway v1.0.0",
    routes: Object.keys(SERVICES).map((key) => `/api/v1/${key}`),
  }
})

// Dynamic Gateway Proxy Handler
async function proxyHandler(request: FastifyRequest, reply: FastifyReply) {
  const urlParts = request.url.split("?")[0].split("/").filter(Boolean)
  // Expected: ['api', 'v1', '<service_segment>', ...]
  const segment = urlParts[2]
  const targetBase = SERVICES[segment]

  if (!targetBase) {
    return reply.status(404).send({ error: `Service route '/api/v1/${segment}' not found`, code: "ROUTE_NOT_FOUND", statusCode: 404 })
  }

  const targetUrl = `${targetBase}${request.url}`

  try {
    const headers: Record<string, string> = {}
    for (const [k, v] of Object.entries(request.headers)) {
      if (typeof v === "string" && k.toLowerCase() !== "host") {
        headers[k] = v
      }
    }

    const hasBody = ["POST", "PUT", "PATCH"].includes(request.method)
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        ...headers,
        "x-forwarded-for": request.ip,
      },
      body: hasBody && request.body ? JSON.stringify(request.body) : undefined,
    })

    const data = await response.text()
    reply.status(response.status)

    const contentType = response.headers.get("content-type")
    if (contentType) {
      reply.header("content-type", contentType)
    }

    return reply.send(data)
  } catch (err: any) {
    fastify.log.error(`Proxy forwarding error to ${targetUrl}: ${err.message}`)
    return reply.status(502).send({
      error: `Downstream service unavailable: ${segment}`,
      code: "BAD_GATEWAY",
      statusCode: 502,
    })
  }
}

// Catch-all proxy route under /api/v1/*
fastify.all("/api/v1/*", proxyHandler)

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: process.env.NODE_ENV === "production" ? ["https://college.ac.th"] : true,
      credentials: true,
    })

    await fastify.register(rateLimit, {
      max: RATE_LIMIT_PER_IP,
      timeWindow: "1 minute",
    })

    const port = Number(process.env.GATEWAY_PORT) || 4000
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`API Gateway listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
