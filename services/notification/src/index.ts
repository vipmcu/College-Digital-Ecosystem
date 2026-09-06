import Fastify from "fastify"
import cors from "@fastify/cors"

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
  },
})

// In-memory notification dispatch log for MVP
interface NotificationMessage {
  id: string
  channel: "email" | "sms" | "in_app"
  recipient: string
  subject: string
  body: string
  sentAt: string
}

const sentNotifications: NotificationMessage[] = []

fastify.get("/health", async () => {
  return {
    status: "ok",
    service: "notification",
    description: "Shared Notification Service (Email/SMS)",
    timestamp: new Date().toISOString(),
  }
})

// Send notification endpoint
fastify.post("/api/v1/notifications/send", async (request, reply) => {
  const body = request.body as any
  const notif: NotificationMessage = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    channel: body.channel || "email",
    recipient: body.recipient,
    subject: body.subject,
    body: body.body,
    sentAt: new Date().toISOString(),
  }

  sentNotifications.unshift(notif)
  if (sentNotifications.length > 100) sentNotifications.pop()

  fastify.log.info(`[NOTIFICATION SENT] [${notif.channel.toUpperCase()}] To: ${notif.recipient} | Subject: ${notif.subject}`)
  return reply.status(201).send({ data: notif })
})

// List recent notifications (for dev / audit)
fastify.get("/api/v1/notifications", async (_request, reply) => {
  return reply.send({ data: sentNotifications })
})

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    })

    const port = Number(process.env.PORT) || 4005
    await fastify.listen({ port, host: "0.0.0.0" })
    fastify.log.info(`Notification Service listening on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
