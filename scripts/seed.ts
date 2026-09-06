import { prisma } from "@repo/db"

declare const process: {
  exit: (code?: number) => never
}

async function main() {
  console.log("🌱 Seeding database...")

  // 1. Roles
  const roles = [
    { code: "student", nameTh: "นักศึกษา", nameEn: "Student", isSystem: true },
    { code: "instructor", nameTh: "อาจารย์ผู้สอน", nameEn: "Instructor", isSystem: true },
    { code: "registrar", nameTh: "เจ้าหน้าที่ทะเบียน", nameEn: "Registrar Officer", isSystem: true },
    { code: "document_officer", nameTh: "เจ้าหน้าที่สารบรรณ", nameEn: "Document Officer", isSystem: true },
    { code: "executive", nameTh: "ผู้บริหาร", nameEn: "Executive", isSystem: true },
    { code: "it_admin", nameTh: "ผู้ดูแลระบบไอที", nameEn: "IT Administrator", isSystem: true },
    { code: "dpo", nameTh: "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล", nameEn: "Data Protection Officer", isSystem: true },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { nameTh: role.nameTh, nameEn: role.nameEn },
      create: role,
    })
  }
  console.log(`✅ Seeded ${roles.length} system roles`)

  // 2. Organizations
  const college = await prisma.organization.upsert({
    where: { code: "COLLEGE-001" },
    update: {},
    create: {
      code: "COLLEGE-001",
      nameTh: "วิทยาลัยดิจิทัล",
      nameEn: "Digital College",
      orgType: "college",
      isActive: true,
    },
  })

  const csFaculty = await prisma.organization.upsert({
    where: { code: "FAC-CS" },
    update: {},
    create: {
      code: "FAC-CS",
      nameTh: "คณะวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
      nameEn: "Faculty of Computer Science and IT",
      orgType: "faculty",
      parentId: college.id,
      isActive: true,
    },
  })

  const registrarOffice = await prisma.organization.upsert({
    where: { code: "DIV-REG" },
    update: {},
    create: {
      code: "DIV-REG",
      nameTh: "สำนักส่งเสริมวิชาการและงานทะเบียน",
      nameEn: "Office of Academic Promotion and Registration",
      orgType: "unit",
      parentId: college.id,
      isActive: true,
    },
  })
  console.log("✅ Seeded Organizations")

  // 3. Document Types
  const docTypes = [
    { code: "PETITION_GENERAL", nameTh: "คำร้องทั่วไป", nameEn: "General Petition" },
    { code: "PETITION_LEAVE", nameTh: "คำร้องขอลาพักการศึกษา", nameEn: "Leave of Absence Petition" },
    { code: "CERT_STUDENT_STATUS", nameTh: "ใบรับรองสภาพนักศึกษา", nameEn: "Student Status Certificate" },
  ]

  for (const dt of docTypes) {
    await prisma.documentType.upsert({
      where: { code: dt.code },
      update: { nameTh: dt.nameTh, nameEn: dt.nameEn },
      create: dt,
    })
  }
  console.log(`✅ Seeded ${docTypes.length} document types`)

  // 4. Default Admin User
  const itAdminRole = await prisma.role.findUniqueOrThrow({ where: { code: "it_admin" } })
  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: "student" } })
  const instructorRole = await prisma.role.findUniqueOrThrow({ where: { code: "instructor" } })

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: { passwordHash: "adminpassword" },
    create: {
      username: "admin",
      passwordHash: "adminpassword",
      email: "admin@college.ac.th",
      firstNameTh: "ผู้ดูแล",
      lastNameTh: "ระบบสารสนเทศ",
      firstNameEn: "System",
      lastNameEn: "Administrator",
      userType: "admin",
      orgUnitId: college.id,
      isActive: true,
    },
  })

  await prisma.userRole.upsert({
    where: {
      userId_roleId_orgUnitId: {
        userId: adminUser.id,
        roleId: itAdminRole.id,
        orgUnitId: college.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: itAdminRole.id,
      orgUnitId: college.id,
    },
  })
  console.log("✅ Seeded Default System Administrator User (admin@college.ac.th / adminpassword)")

  // 5. Default Instructor User
  const instructorUser = await prisma.user.upsert({
    where: { username: "instructor01" },
    update: { passwordHash: "password123" },
    create: {
      username: "instructor01",
      passwordHash: "password123",
      email: "instructor01@college.ac.th",
      firstNameTh: "สมชาย",
      lastNameTh: "อาจารย์ยอดเยี่ยม",
      firstNameEn: "Somchai",
      lastNameEn: "Teacher",
      userType: "instructor",
      orgUnitId: csFaculty.id,
      isActive: true,
    },
  })

  await prisma.userRole.upsert({
    where: {
      userId_roleId_orgUnitId: {
        userId: instructorUser.id,
        roleId: instructorRole.id,
        orgUnitId: csFaculty.id,
      },
    },
    update: {},
    create: {
      userId: instructorUser.id,
      roleId: instructorRole.id,
      orgUnitId: csFaculty.id,
    },
  })
  console.log("✅ Seeded Default Instructor User (instructor01@college.ac.th / password123)")

  // 6. Default Student User
  const studentUser = await prisma.user.upsert({
    where: { username: "student01" },
    update: { passwordHash: "password123" },
    create: {
      username: "student01",
      passwordHash: "password123",
      email: "student01@college.ac.th",
      firstNameTh: "สมศรี",
      lastNameTh: "เรียนดี",
      firstNameEn: "Somsri",
      lastNameEn: "Learner",
      userType: "student",
      orgUnitId: csFaculty.id,
      isActive: true,
    },
  })

  await prisma.userRole.upsert({
    where: {
      userId_roleId_orgUnitId: {
        userId: studentUser.id,
        roleId: studentRole.id,
        orgUnitId: csFaculty.id,
      },
    },
    update: {},
    create: {
      userId: studentUser.id,
      roleId: studentRole.id,
      orgUnitId: csFaculty.id,
    },
  })
  console.log("✅ Seeded Default Student User (student01@college.ac.th / password123)")

  console.log("✨ Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
