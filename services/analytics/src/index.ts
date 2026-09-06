import Fastify from "fastify"
import cors from "@fastify/cors"
import { dashboardRoutes } from "./routes/dashboard.routes.js"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// Health check
fastify.get("/health", async () => {
  return {
    status: "ok",
    service: "analytics",
    description: "M04 Executive Dashboard & Reporting Service",
    timestamp: new Date().toISOString(),
  }
})

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    })

    // Register analytics routes
    await fastify.register(dashboardRoutes, { prefix: "/api/v1/analytics" })

    const port = Number(process.env.PORT) || 4004
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`Analytics Service listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
