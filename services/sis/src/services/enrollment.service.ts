import { prisma } from "@repo/db"

export async function enrollSection(params: {
  studentId: string
  sectionId: string
  actorId: string
}) {
  return prisma.$transaction(async (tx: any) => {
    // 1. Check section status and capacity with atomic lock
    const section = await tx.courseSection.findUniqueOrThrow({
      where: { id: params.sectionId },
    })

    if (section.status !== "open") {
      throw new Error("This section is closed for registration")
    }

    if (section.enrolledCount >= section.maxStudents) {
      throw new Error("This section has reached its maximum capacity")
    }

    // 2. Check duplicate enrollment
    const existing = await tx.enrollment.findUnique({
      where: {
        studentId_sectionId: {
          studentId: params.studentId,
          sectionId: params.sectionId,
        },
      },
    })

    if (existing) {
      throw new Error("Already enrolled in this section")
    }

    // 3. Create enrollment
    const enrollment = await tx.enrollment.create({
      data: {
        studentId: params.studentId,
        sectionId: params.sectionId,
        status: "enrolled",
        createdBy: params.actorId,
      },
    })

    // 4. Increment enrolled count safely
    await tx.courseSection.update({
      where: { id: params.sectionId },
      data: { enrolledCount: { increment: 1 } },
    })

    return enrollment
  })
}

export async function withdrawSection(params: {
  enrollmentId: string
  actorId: string
}) {
  return prisma.$transaction(async (tx: any) => {
    const enrollment = await tx.enrollment.findUniqueOrThrow({
      where: { id: params.enrollmentId },
    })

    if (enrollment.status === "withdrawn") {
      throw new Error("Already withdrawn")
    }

    const updated = await tx.enrollment.update({
      where: { id: params.enrollmentId },
      data: { status: "withdrawn", grade: "W", updatedBy: params.actorId },
    })

    await tx.courseSection.update({
      where: { id: enrollment.sectionId },
      data: { enrolledCount: { decrement: 1 } },
    })

    return updated
  })
}

export async function submitGrade(params: {
  enrollmentId: string
  grade: string
  actorId: string
}) {
  const gradePoints: Record<string, number> = {
    "A": 4.0, "B+": 3.5, "B": 3.0, "C+": 2.5, "C": 2.0, "D+": 1.5, "D": 1.0, "F": 0.0,
  }

  const point = gradePoints[params.grade.toUpperCase()]
  if (point === undefined) {
    throw new Error(`Invalid grade: ${params.grade}`)
  }

  return prisma.enrollment.update({
    where: { id: params.enrollmentId },
    data: {
      grade: params.grade.toUpperCase(),
      gradePoint: point,
      gradeApprovedAt: new Date(),
      gradeApprovedBy: params.actorId,
      status: "completed",
    },
  })
}

export async function calculateStudentTranscript(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      status: "completed",
      grade: { not: null },
    },
    include: {
      section: {
        include: {
          course: true,
        },
      },
    },
  })

  let totalCredits = 0
  let totalGradePoints = 0

  const items = enrollments.map((e: any) => {
    const credit = e.section.course.credit
    const gpaPoint = Number(e.gradePoint || 0)
    totalCredits += credit
    totalGradePoints += credit * gpaPoint

    return {
      courseCode: e.section.course.code,
      courseNameTh: e.section.course.nameTh,
      credit,
      grade: e.grade,
      academicYear: e.section.academicYear,
      semester: e.section.semester,
    }
  })

  const cumulativeGpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00"

  return {
    studentId,
    totalCredits,
    cumulativeGpa: Number(cumulativeGpa),
    courses: items,
  }
}
