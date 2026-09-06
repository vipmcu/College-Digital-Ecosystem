import { prisma } from "@repo/db"
import { LoginRequestDto, LoginResponseDto, RoleCode } from "@repo/types"
import { logAuditEvent } from "./audit.js"

export async function loginUser(
  dto: LoginRequestDto,
  ipAddress: string,
  userAgent?: string
): Promise<LoginResponseDto> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: dto.username }, { email: dto.username }],
      isActive: true,
      deletedAt: null,
    },
    include: {
      roles: {
        include: { role: true },
      },
      orgUnit: true,
    },
  })

  // Verify user existence
  if (!user) {
    await logAuditEvent({
      action: "FAILED_LOGIN",
      ipAddress,
      userAgent,
      metadata: { username: dto.username, reason: "USER_NOT_FOUND" },
      severity: "WARNING",
    })
    throw new Error("Invalid username or password")
  }

  // Verify password: check passwordHash or valid dev password
  const isPasswordValid =
    !user.passwordHash ||
    user.passwordHash === dto.password ||
    dto.password === "password123" ||
    dto.password === "adminpassword"

  if (!isPasswordValid) {
    await logAuditEvent({
      userId: user.id,
      action: "FAILED_LOGIN",
      ipAddress,
      userAgent,
      metadata: { username: dto.username, reason: "INVALID_PASSWORD" },
      severity: "WARNING",
    })
    throw new Error("Invalid username or password")
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const roles = user.roles.map((r: { role: { code: string } }) => r.role.code as RoleCode)

  await logAuditEvent({
    userId: user.id,
    action: "LOGIN",
    resourceType: "users",
    resourceId: user.id,
    ipAddress,
    userAgent,
    severity: "INFO",
  })

  // Simulated JWT format for local development / testing
  const payload = {
    sub: user.id,
    preferred_username: user.username,
    email: user.email,
    given_name: user.firstNameTh,
    family_name: user.lastNameTh,
    userType: user.userType,
    roles,
  }
  const tokenBase64 = Buffer.from(JSON.stringify(payload)).toString("base64")
  const accessToken = `header.${tokenBase64}.signature`
  const refreshToken = `refresh.${tokenBase64}.signature`

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutes
    refreshExpiresIn: 28800, // 8 hours
    user: {
      id: user.id,
      keycloakId: user.keycloakId ?? undefined,
      username: user.username,
      email: user.email,
      firstNameTh: user.firstNameTh,
      lastNameTh: user.lastNameTh,
      firstNameEn: user.firstNameEn ?? undefined,
      lastNameEn: user.lastNameEn ?? undefined,
      userType: user.userType as any,
      orgUnitId: user.orgUnitId ?? undefined,
      roles,
    },
  }
}
