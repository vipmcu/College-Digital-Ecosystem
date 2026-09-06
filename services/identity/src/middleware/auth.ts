import { FastifyRequest, FastifyReply } from "fastify"
import { RoleCode, AuthUser } from "@repo/types"
import { hasPermission, AppResource, PermissionAction } from "@repo/utils"

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Unauthorized: Missing or invalid token", code: "UNAUTHORIZED", statusCode: 401 })
  }

  // Token decode (supports dev test token format: dev-token:<userId>)
  const token = authHeader.replace("Bearer ", "").trim()
  if (token.startsWith("dev-token:")) {
    const username = token.replace("dev-token:", "")
    request.user = {
      id: "00000000-0000-0000-0000-000000000001",
      keycloakId: "kc-" + username,
      username,
      email: `${username}@college.ac.th`,
      firstNameTh: "ทดสอบ",
      lastNameTh: "ผู้ใช้งาน",
      userType: "admin",
      roles: ["it_admin"],
    }
    return
  }

  // Parse simulated / standard JWT payload
  try {
    const parts = token.split(".")
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
      request.user = {
        id: payload.sub || "user-id",
        keycloakId: payload.sub || "kc-id",
        username: payload.preferred_username || "user",
        email: payload.email || "user@college.ac.th",
        firstNameTh: payload.given_name || "ชื่อ",
        lastNameTh: payload.family_name || "นามสกุล",
        userType: payload.userType || "staff",
        roles: (payload.roles || ["student"]) as RoleCode[],
      }
      return
    }
  } catch {
    return reply.status(401).send({ error: "Invalid token payload", code: "INVALID_TOKEN", statusCode: 401 })
  }

  return reply.status(401).send({ error: "Authentication failed", code: "AUTH_FAILED", statusCode: 401 })
}

export function requireRole(allowedRoles: RoleCode[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await requireAuth(request, reply)
    if (reply.sent) return

    const userRoles = request.user?.roles || []
    const hasRole = allowedRoles.some((role) => userRoles.includes(role))
    if (!hasRole) {
      return reply.status(403).send({ error: "Forbidden: Insufficient privileges", code: "FORBIDDEN", statusCode: 403 })
    }
  }
}

export function requirePermissionCheck(resource: AppResource, action: PermissionAction) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await requireAuth(request, reply)
    if (reply.sent) return

    const userRoles = request.user?.roles || []
    if (!hasPermission(userRoles, resource, action)) {
      return reply.status(403).send({ error: `Forbidden: No permission to ${action} ${resource}`, code: "FORBIDDEN_RESOURCE", statusCode: 403 })
    }
  }
}
