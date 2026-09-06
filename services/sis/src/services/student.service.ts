import { prisma } from "@repo/db"
import { encryptPii, decryptPii, maskPii } from "@repo/utils"

export async function listStudents(query: { page?: number; limit?: number; search?: string }) {
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
  const skip = (page - 1) * limit

  const where: any = { deletedAt: null }
  if (query.search) {
    where.OR = [
      { studentCode: { contains: query.search } },
      { user: { firstNameTh: { contains: query.search, mode: "insensitive" } } },
      { user: { lastNameTh: { contains: query.search, mode: "insensitive" } } },
    ]
  }

  const [total, items] = await Promise.all([
    prisma.student.count({ where }),
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, username: true, email: true, firstNameTh: true, lastNameTh: true } },
        program: true,
      },
      orderBy: { studentCode: "asc" },
    }),
  ])

  return {
    data: items.map((s: any) => ({
      id: s.id,
      studentCode: s.studentCode,
      enrollmentYear: s.enrollmentYear,
      status: s.status,
      user: s.user,
      program: s.program ? { code: s.program.code, nameTh: s.program.nameTh } : null,
      maskedPhone: s.encPhone ? maskPii(decryptPii(s.encPhone), "phone") : null,
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

export async function createStudentProfile(data: {
  userId: string
  studentCode: string
  enrollmentYear: number
  programId?: string
  nationalId?: string
  phone?: string
  birthDate?: string
  address?: string
  actorId: string
  ipAddress: string
}) {
  const encNationalId = data.nationalId ? encryptPii(data.nationalId) : undefined
  const encPhone = data.phone ? encryptPii(data.phone) : undefined

  const student = await prisma.student.create({
    data: {
      userId: data.userId,
      studentCode: data.studentCode,
      enrollmentYear: data.enrollmentYear,
      programId: data.programId,
      encNationalId,
      encPhone,
      piiBirthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      piiAddress: data.address,
      createdBy: data.actorId,
    },
  })

  // RULE S-05: Audit log for PII creation
  await prisma.auditLog.create({
    data: {
      userId: data.actorId,
      action: "CREATE_STUDENT_PII",
      resourceType: "students",
      resourceId: student.id,
      ipAddress: data.ipAddress || "127.0.0.1",
      severity: "INFO",
    },
  })

  return student
}

export async function getStudentById(id: string, actorId: string, ipAddress: string) {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id },
    include: {
      user: true,
      program: true,
    },
  })

  // RULE S-05: Audit log for PII Access
  await prisma.auditLog.create({
    data: {
      userId: actorId,
      action: "PII_ACCESS",
      resourceType: "students",
      resourceId: student.id,
      ipAddress: ipAddress || "127.0.0.1",
      metadata: { studentCode: student.studentCode },
      severity: "INFO",
    },
  })

  return {
    ...student,
    nationalId: student.encNationalId ? decryptPii(student.encNationalId) : null,
    phone: student.encPhone ? decryptPii(student.encPhone) : null,
  }
}
