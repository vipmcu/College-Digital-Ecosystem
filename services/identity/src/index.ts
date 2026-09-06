import Fastify from "fastify"
import cors from "@fastify/cors"
import { authRoutes } from "./routes/auth.routes.js"
import { userRoutes } from "./routes/user.routes.js"
import { auditRoutes } from "./routes/audit.routes.js"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// Health check
fastify.get("/health", async () => {
  return {
    status: "ok",
    service: "identity",
    description: "M01 Identity & SSO Service",
    timestamp: new Date().toISOString(),
  }
})

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    })

    // Register API routes under /api/v1
    await fastify.register(authRoutes, { prefix: "/api/v1/auth" })
    await fastify.register(userRoutes, { prefix: "/api/v1/users" })
    await fastify.register(auditRoutes, { prefix: "/api/v1/audit-logs" })

    const port = Number(process.env.PORT) || 4001
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`Identity Service listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
