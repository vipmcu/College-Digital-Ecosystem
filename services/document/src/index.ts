import Fastify from "fastify"
import cors from "@fastify/cors"
import { documentRoutes } from "./routes/document.routes.js"
import { workflowRoutes } from "./routes/workflow.routes.js"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// Health check
fastify.get("/health", async () => {
  return {
    status: "ok",
    service: "document",
    description: "M03 e-Document & Approval Workflow Service",
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
    await fastify.register(documentRoutes, { prefix: "/api/v1/documents" })
    await fastify.register(workflowRoutes, { prefix: "/api/v1/workflows" })

    const port = Number(process.env.PORT) || 4003
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`Document Service listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
