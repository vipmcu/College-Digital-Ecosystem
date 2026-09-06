import { prisma } from "@repo/db"
import { CreateUserRequestDto, UpdateUserRequestDto, BulkImportRowDto, BulkImportResultDto, RoleCode } from "@repo/types"
import { logAuditEvent } from "./audit.js"

export async function listUsers(query: { page?: number; limit?: number; search?: string; role?: string }) {
  const page = Math.max(1, query.page || 1)
  const limit = Math.min(100, Math.max(1, query.limit || 20))
  const skip = (page - 1) * limit

  const where: any = { deletedAt: null }
  if (query.search) {
    where.OR = [
      { username: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
      { firstNameTh: { contains: query.search, mode: "insensitive" } },
      { lastNameTh: { contains: query.search, mode: "insensitive" } },
    ]
  }
  if (query.role) {
    where.roles = {
      some: {
        role: { code: query.role },
      },
    }
  }

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        roles: { include: { role: true } },
        orgUnit: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return {
    data: items.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      firstNameTh: u.firstNameTh,
      lastNameTh: u.lastNameTh,
      firstNameEn: u.firstNameEn,
      lastNameEn: u.lastNameEn,
      userType: u.userType,
      isActive: u.isActive,
      orgUnit: u.orgUnit ? { id: u.orgUnit.id, nameTh: u.orgUnit.nameTh, code: u.orgUnit.code } : null,
      roles: u.roles.map((r: any) => r.role.code),
      createdAt: u.createdAt,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function createUser(dto: CreateUserRequestDto, actorId: string, ipAddress: string) {
  const user = await prisma.user.create({
    data: {
      keycloakId: `kc-${dto.username}-${Date.now()}`,
      username: dto.username,
      email: dto.email,
      firstNameTh: dto.firstNameTh,
      lastNameTh: dto.lastNameTh,
      firstNameEn: dto.firstNameEn,
      lastNameEn: dto.lastNameEn,
      userType: dto.userType,
      orgUnitId: dto.orgUnitId,
      createdBy: actorId,
    },
  })

  // Assign roles
  if (dto.roles && dto.roles.length > 0) {
    const roles = await prisma.role.findMany({
      where: { code: { in: dto.roles } },
    })
    for (const role of roles) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
          orgUnitId: dto.orgUnitId,
          grantedBy: actorId,
        },
      })
    }
  }

  await logAuditEvent({
    userId: actorId,
    action: "CREATE_USER",
    resourceType: "users",
    resourceId: user.id,
    ipAddress,
    metadata: { createdUsername: user.username },
    severity: "INFO",
  })

  return user
}

export async function updateUser(id: string, dto: UpdateUserRequestDto, actorId: string, ipAddress: string) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      firstNameTh: dto.firstNameTh,
      lastNameTh: dto.lastNameTh,
      firstNameEn: dto.firstNameEn,
      lastNameEn: dto.lastNameEn,
      orgUnitId: dto.orgUnitId,
      isActive: dto.isActive,
      updatedBy: actorId,
    },
  })

  if (dto.roles) {
    await prisma.userRole.deleteMany({ where: { userId: id } })
    const roles = await prisma.role.findMany({ where: { code: { in: dto.roles } } })
    for (const role of roles) {
      await prisma.userRole.create({
        data: {
          userId: id,
          roleId: role.id,
          grantedBy: actorId,
        },
      })
    }
  }

  await logAuditEvent({
    userId: actorId,
    action: "UPDATE_USER",
    resourceType: "users",
    resourceId: id,
    ipAddress,
    metadata: { updatedUserId: id },
    severity: "INFO",
  })

  return user
}

export async function bulkImportUsers(rows: BulkImportRowDto[], actorId: string, ipAddress: string): Promise<BulkImportResultDto> {
  const result: BulkImportResultDto = {
    totalRows: rows.length,
    successCount: 0,
    failedCount: 0,
    errors: [],
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    try {
      const roles = row.roles ? (row.roles.split(",").map((s) => s.trim()) as RoleCode[]) : (["student"] as RoleCode[])
      await createUser(
        {
          username: row.username,
          email: row.email,
          firstNameTh: row.firstNameTh,
          lastNameTh: row.lastNameTh,
          firstNameEn: row.firstNameEn,
          lastNameEn: row.lastNameEn,
          userType: row.userType,
          roles,
        },
        actorId,
        ipAddress
      )
      result.successCount++
    } catch (err: any) {
      result.failedCount++
      result.errors.push({
        row: i + 1,
        username: row.username,
        error: err.message || "Failed to import user",
      })
    }
  }

  await logAuditEvent({
    userId: actorId,
    action: "BULK_IMPORT_USERS",
    resourceType: "users",
    ipAddress,
    metadata: { total: rows.length, success: result.successCount, failed: result.failedCount },
    severity: "INFO",
  })

  return result
}
