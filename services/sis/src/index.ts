import Fastify from "fastify"
import cors from "@fastify/cors"
import { studentRoutes } from "./routes/student.routes.js"
import { academicRoutes } from "./routes/academic.routes.js"
import { enrollmentRoutes } from "./routes/enrollment.routes.js"
import { petitionRoutes } from "./routes/petition.routes.js"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// Health check
fastify.get("/health", async () => {
  return {
    status: "ok",
    service: "sis",
    description: "M02 Student Information System Service",
    timestamp: new Date().toISOString(),
  }
})

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    })

    // Register routes
    await fastify.register(studentRoutes, { prefix: "/api/v1/students" })
    await fastify.register(academicRoutes, { prefix: "/api/v1/academic" })
    await fastify.register(enrollmentRoutes, { prefix: "/api/v1/enrollments" })
    await fastify.register(petitionRoutes, { prefix: "/api/v1/petitions" })

    const port = Number(process.env.PORT) || 4002
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`SIS Service listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
