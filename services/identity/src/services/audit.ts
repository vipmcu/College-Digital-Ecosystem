import { prisma } from "@repo/db"

export interface AuditLogEntry {
  userId?: string
  action: string
  resourceType?: string
  resourceId?: string
  ipAddress: string
  userAgent?: string
  metadata?: Record<string, unknown>
  severity?: "INFO" | "WARNING" | "CRITICAL"
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        ipAddress: entry.ipAddress || "127.0.0.1",
        userAgent: entry.userAgent,
        metadata: entry.metadata as any,
        severity: entry.severity || "INFO",
      },
    })
  } catch (err) {
    // Audit log failure must not crash business logic, but should be logged to console
    console.error("Audit log creation failed:", err)
  }
}
