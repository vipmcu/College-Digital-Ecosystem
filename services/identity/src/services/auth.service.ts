import { prisma } from "@repo/db"
import { LoginRequestDto, LoginResponseDto, RoleCode, UserType } from "@repo/types"
import { logAuditEvent } from "./audit.js"

const DEV_ACCOUNTS: Record<
  string,
  {
    id: string
    username: string
    email: string
    firstNameTh: string
    lastNameTh: string
    password: string
    userType: "student" | "instructor" | "staff" | "admin"
    roles: RoleCode[]
  }
> = {
  admin: {
    id: "usr-admin-001",
    username: "admin",
    email: "admin@college.ac.th",
    firstNameTh: "ผู้ดูแลระบบ",
    lastNameTh: "สวท.",
    password: "adminpassword",
    userType: "admin",
    roles: ["super_admin", "registrar", "system_admin"] as RoleCode[],
  },
  student01: {
    id: "usr-student-001",
    username: "student01",
    email: "student01@college.ac.th",
    firstNameTh: "สมชาย",
    lastNameTh: "ใจดี",
    password: "password123",
    userType: "student",
    roles: ["student"] as RoleCode[],
  },
  instructor01: {
    id: "usr-instructor-001",
    username: "instructor01",
    email: "instructor01@college.ac.th",
    firstNameTh: "ดร.วิชัย",
    lastNameTh: "มุ่งมั่น",
    password: "password123",
    userType: "staff",
    roles: ["instructor", "advisor"] as RoleCode[],
  },
  registrar01: {
    id: "usr-registrar-001",
    username: "registrar01",
    email: "registrar01@college.ac.th",
    firstNameTh: "พิมพา",
    lastNameTh: "รักเรียน",
    password: "password123",
    userType: "staff",
    roles: ["registrar"] as RoleCode[],
  },
}

type UserWithRelations = NonNullable<
  Awaited<
    ReturnType<
      typeof prisma.user.findFirst<{
        include: {
          roles: {
            include: { role: true }
          }
          orgUnit: true
        }
      }>
    >
  >
>

export async function loginUser(
  dto: LoginRequestDto,
  ipAddress: string,
  userAgent?: string
): Promise<LoginResponseDto> {
  let user: UserWithRelations | null = null
  let dbAvailable = true

  try {
    user = await prisma.user.findFirst({
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
  } catch (err) {
    dbAvailable = false
  }

  // If database is offline or user not found in DB, check dev fallback accounts
  if (!user) {
    const cleanUser = dto.username.trim().toLowerCase()
    const devMatch = Object.values(DEV_ACCOUNTS).find(
      (d) => d.username.toLowerCase() === cleanUser || d.email.toLowerCase() === cleanUser
    )

    if (devMatch && (dto.password === devMatch.password || dto.password === "password123" || dto.password === "adminpassword")) {
      const payload = {
        sub: devMatch.id,
        preferred_username: devMatch.username,
        email: devMatch.email,
        given_name: devMatch.firstNameTh,
        family_name: devMatch.lastNameTh,
        userType: devMatch.userType,
        roles: devMatch.roles,
      }
      const tokenBase64 = Buffer.from(JSON.stringify(payload)).toString("base64")
      return {
        accessToken: `header.${tokenBase64}.signature`,
        refreshToken: `refresh.${tokenBase64}.signature`,
        expiresIn: 900,
        refreshExpiresIn: 28800,
        user: {
          id: devMatch.id,
          username: devMatch.username,
          email: devMatch.email,
          firstNameTh: devMatch.firstNameTh,
          lastNameTh: devMatch.lastNameTh,
          userType: devMatch.userType,
          roles: devMatch.roles,
        },
      }
    }

    if (dbAvailable) {
      try {
        await logAuditEvent({
          action: "FAILED_LOGIN",
          ipAddress,
          userAgent,
          metadata: { username: dto.username, reason: "USER_NOT_FOUND" },
          severity: "WARNING",
        })
      } catch {
        // ignore audit write error
      }
    }
    throw new Error("Invalid username or password")
  }

  // Verify password: check passwordHash or valid dev password
  const isPasswordValid =
    !user.passwordHash ||
    user.passwordHash === dto.password ||
    dto.password === "password123" ||
    dto.password === "adminpassword"

  if (!isPasswordValid) {
    try {
      await logAuditEvent({
        userId: user.id,
        action: "FAILED_LOGIN",
        ipAddress,
        userAgent,
        metadata: { username: dto.username, reason: "INVALID_PASSWORD" },
        severity: "WARNING",
      })
    } catch {
      // ignore
    }
    throw new Error("Invalid username or password")
  }

  // Update last login if DB connected
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
  } catch {
    // ignore
  }

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
      userType: user.userType as UserType,
      orgUnitId: user.orgUnitId ?? undefined,
      roles,
    },
  }
}
