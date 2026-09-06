'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface CourseSection {
  id: string
  code: string
  nameTh: string
  nameEn: string
  credits: number
  section: string
  instructor: string
  schedule: string
  room: string
  enrolled: number
  capacity: number
  prereq?: string
}

interface GradeItem {
  code: string
  nameTh: string
  credits: number
  grade: "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F" | "S"
}

interface TermGrades {
  term: string
  termGpa: number
  cumulativeGpa: number
  termCredits: number
  cumulativeCredits: number
  courses: GradeItem[]
}

const academicHistory: TermGrades[] = [
  {
    term: "ภาคเรียนที่ 1/2566",
    termGpa: 3.82,
    cumulativeGpa: 3.82,
    termCredits: 18,
    cumulativeCredits: 18,
    courses: [
      { code: "CS-101-001", nameTh: "การโปรแกรมคอมพิวเตอร์พื้นฐาน", credits: 3, grade: "A" },
      { code: "CS-102-001", nameTh: "คณิตศาสตร์ดิสครีตสำหรับวิทยาการคอมพิวเตอร์", credits: 3, grade: "A" },
      { code: "MATH-101-002", nameTh: "แคลคูลัสสำหรับวิทยาศาสตร์คอมพิวเตอร์ 1", credits: 3, grade: "B+" },
      { code: "SCI-101-001", nameTh: "ฟิสิกส์ทั่วไปสำหรับการคำนวณ", credits: 3, grade: "A" },
      { code: "GEN-101-003", nameTh: "การใช้ภาษาไทยเพื่อการสื่อสารเชิงวิชาการ", credits: 3, grade: "A" },
      { code: "GEN-102-002", nameTh: "ภาษาอังกฤษเพื่อการสื่อสารระดับสากล 1", credits: 3, grade: "B+" },
    ],
  },
  {
    term: "ภาคเรียนที่ 2/2566",
    termGpa: 3.65,
    cumulativeGpa: 3.73,
    termCredits: 19,
    cumulativeCredits: 37,
    courses: [
      { code: "CS-201-001", nameTh: "โครงสร้างข้อมูลและขั้นตอนวิธี", credits: 3, grade: "A" },
      { code: "CS-202-001", nameTh: "การจัดระบบและสถาปัตยกรรมคอมพิวเตอร์", credits: 3, grade: "B+" },
      { code: "CS-203-002", nameTh: "การโปรแกรมเชิงวัตถุและการออกแบบซอฟต์แวร์", credits: 3, grade: "A" },
      { code: "MATH-102-001", nameTh: "แคลคูลัสสำหรับวิทยาศาสตร์คอมพิวเตอร์ 2", credits: 3, grade: "B" },
      { code: "GEN-103-004", nameTh: "ภาษาอังกฤษเพื่อการสื่อสารระดับสากล 2", credits: 3, grade: "A" },
      { code: "GEN-202-001", nameTh: "สังคม การเมือง และการเปลี่ยนแปลงในยุคดิจิทัล", credits: 3, grade: "A" },
      { code: "ACT-101-001", nameTh: "กิจกรรมเสริมหลักสูตรวิชาการ 1", credits: 1, grade: "S" },
    ],
  },
  {
    term: "ภาคเรียนที่ 1/2567",
    termGpa: 3.71,
    cumulativeGpa: 3.72,
    termCredits: 18,
    cumulativeCredits: 55,
    courses: [
      { code: "CS-304-001", nameTh: "ระบบการจัดการฐานข้อมูลและการจำลองข้อมูล", credits: 3, grade: "A" },
      { code: "CS-305-001", nameTh: "วิศวกรรมซอฟต์แวร์และการบริหารโครงการ", credits: 3, grade: "A" },
      { code: "CS-306-002", nameTh: "ระบบปฏิบัติการและการประมวลผลแบบกระจาย", credits: 3, grade: "B+" },
      { code: "MATH-201-001", nameTh: "พีชคณิตเชิงเส้นและสถิติประยุกต์สำหรับ AI", credits: 3, grade: "B+" },
      { code: "GEN-203-003", nameTh: "จริยธรรมและกฎหมายเทคโนโลยีสารสนเทศ", credits: 3, grade: "A" },
      { code: "GEN-204-002", nameTh: "ทักษะความเป็นผู้ประกอบการนวัตกรรม", credits: 3, grade: "A" },
    ],
  },
  {
    term: "ภาคเรียนที่ 2/2567",
    termGpa: 3.6,
    cumulativeGpa: 3.68,
    termCredits: 19,
    cumulativeCredits: 74,
    courses: [
      { code: "CS-307-001", nameTh: "เทคโนโลยีเว็บเชิงลึกและเว็บเซอร์วิส", credits: 3, grade: "A" },
      { code: "CS-308-001", nameTh: "เครือข่ายคอมพิวเตอร์และความปลอดภัยไซเบอร์", credits: 3, grade: "B+" },
      { code: "CS-310-002", nameTh: "ปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง", credits: 3, grade: "B+" },
      { code: "CS-312-001", nameTh: "สถาปัตยกรรมไมโครเซอร์วิสและคลาวด์เนทีฟ", credits: 3, grade: "A" },
      { code: "GEN-301-001", nameTh: "ภาวะผู้นำและการทำงานร่วมกันเป็นทีม", credits: 3, grade: "A" },
      { code: "FREE-101-001", nameTh: "การถ่ายภาพและการสื่อความหมายด้วยภาพ", credits: 3, grade: "A" },
      { code: "ACT-102-001", nameTh: "กิจกรรมเสริมหลักสูตรวิชาการ 2", credits: 1, grade: "S" },
    ],
  },
]

interface PetitionItem {
  id: string
  petitionNumber: string
  title: string
  type: string
  term: string
  submittedAt: string
  reason: string
  status: "approved" | "pending_advisor" | "pending_dean" | "rejected"
  currentStep: string
  advisor: string
}

const initialPetitions: PetitionItem[] = [
  {
    id: "pet-01",
    petitionNumber: "REQ-2569-0018",
    title: "คำร้องขอเปิดรายวิชา CS-302 Cloud Architecture เพิ่มเป็นกรณีพิเศษ",
    type: "ขอเปิดรายวิชาเพิ่มเป็นกรณีพิเศษ (Course Expansion)",
    term: "1/2569",
    submittedAt: "2 ก.ย. 2569 10:15 น.",
    reason: "นักศึกษาตกค้างแผนการเรียนชั้นปีที่ 3 มีความจำเป็นต้องลงทะเบียนเรียนเพื่อจบตามหลักสูตร",
    status: "approved",
    currentStep: "อนุมัติเรียบร้อยแล้ว (คณบดีลงนาม)",
    advisor: "ดร. วิชัย มุ่งมั่น",
  },
  {
    id: "pet-02",
    petitionNumber: "REQ-2569-0042",
    title: "คำร้องขอหนังสือรับรองสถานภาพนักศึกษาภาษาอังกฤษ (Official Certificate)",
    type: "ขอหนังสือรับรองสถานภาพนักศึกษา (Student Status)",
    term: "1/2569",
    submittedAt: "4 ก.ย. 2569 14:30 น.",
    reason: "ใช้ยื่นประกอบการสมัครเข้าร่วมโครงการแลกเปลี่ยนนักศึกษานานาชาติ ณ ประเทศญี่ปุ่น",
    status: "pending_dean",
    currentStep: "ขั้นตอนที่ 2/3: อยู่ระหว่างรอคณบดีลงนาม",
    advisor: "ดร. วิชัย มุ่งมั่น",
  },
  {
    id: "pet-03",
    petitionNumber: "REQ-2569-0061",
    title: "คำร้องขอลงทะเบียนเกินหน่วยกิตที่กำหนด (24 หน่วยกิต)",
    type: "ขอลงทะเบียนเกินหน่วยกิต (Overcredit Request)",
    term: "1/2569",
    submittedAt: "5 ก.ย. 2569 09:20 น.",
    reason: "มีเกรดเฉลี่ยสะสม 3.68 เกินเกณฑ์ 3.25 มีความประสงค์ลงทะเบียนเพิ่มเพื่อเก็บวิชาเลือกเสรี",
    status: "pending_advisor",
    currentStep: "ขั้นตอนที่ 1/3: รออาจารย์ที่ปรึกษาพิจารณา",
    advisor: "ดร. วิชัย มุ่งมั่น",
  },
]

interface ScheduleBlock {
  dayTh: string
  dayEn: string
  color: string
  courseCode: string
  courseName: string
  time: string
  room: string
  section: string
  instructor: string
}

const weeklySchedule: ScheduleBlock[] = [
  {
    dayTh: "จันทร์",
    dayEn: "Monday",
    color: "bg-amber-500/10 border-amber-500 text-amber-900",
    courseCode: "CS-301-001",
    courseName: "การออกแบบและวิเคราะห์ขั้นตอนวิธีขั้นสูง",
    time: "09:00 - 12:00 น.",
    room: "Lab Com 401 อาคาร 4",
    section: "ตอนเรียน 01",
    instructor: "รศ.ดร. นันทิกร วิเศษสุข",
  },
  {
    dayTh: "อังคาร",
    dayEn: "Tuesday",
    color: "bg-purple-500/10 border-purple-500 text-purple-900",
    courseCode: "CS-302-001",
    courseName: "สถาปัตยกรรมระบบคลาวด์และไมโครเซอร์วิส",
    time: "13:00 - 16:00 น.",
    room: "Lab Com 305 อาคาร 3",
    section: "ตอนเรียน 01",
    instructor: "ผศ.ดร. ภาณุพงศ์ วงศ์สวรรค์",
  },
  {
    dayTh: "พุธ",
    dayEn: "Wednesday",
    color: "bg-emerald-500/10 border-emerald-500 text-emerald-900",
    courseCode: "CS-303-002",
    courseName: "ความมั่นคงปลอดภัยสารสนเทศและกฎหมาย PDPA",
    time: "09:00 - 12:00 น.",
    room: "Auditorium 2 อาคารบรรยายรวม",
    section: "ตอนเรียน 02",
    instructor: "ดร. เอกชัย ปกป้อง",
  },
  {
    dayTh: "พฤหัสบดี",
    dayEn: "Thursday",
    color: "bg-blue-500/10 border-blue-500 text-blue-900",
    courseCode: "GEN-201-003",
    courseName: "ภาษาอังกฤษเชิงวิชาการและการนำเสนอผลงาน",
    time: "13:00 - 16:00 น.",
    room: "LC 204 อาคารศูนย์ภาษา",
    section: "ตอนเรียน 03",
    instructor: "อ. จอห์นสัน แอนเดอร์สัน",
  },
]

interface ExamItem {
  date: string
  time: string
  courseCode: string
  courseName: string
  type: "กลางภาค (Midterm)" | "ปลายภาค (Final)"
  room: string
  seat: string
}

const examSchedule: ExamItem[] = [
  {
    date: "16 ต.ค. 2569",
    time: "09:00 - 12:00 น.",
    courseCode: "CS-301-001",
    courseName: "การออกแบบและวิเคราะห์ขั้นตอนวิธีขั้นสูง",
    type: "กลางภาค (Midterm)",
    room: "ห้อง 401 อาคาร 4",
    seat: "ที่นั่ง A-12",
  },
  {
    date: "18 ต.ค. 2569",
    time: "13:30 - 16:30 น.",
    courseCode: "CS-302-001",
    courseName: "สถาปัตยกรรมระบบคลาวด์และไมโครเซอร์วิส",
    type: "กลางภาค (Midterm)",
    room: "ห้อง 305 อาคาร 3",
    seat: "ที่นั่ง B-08",
  },
  {
    date: "20 ต.ค. 2569",
    time: "09:00 - 12:00 น.",
    courseCode: "CS-303-002",
    courseName: "ความมั่นคงปลอดภัยสารสนเทศและกฎหมาย PDPA",
    type: "กลางภาค (Midterm)",
    room: "Auditorium 2",
    seat: "ที่นั่ง C-35",
  },
  {
    date: "19 ธ.ค. 2569",
    time: "09:00 - 12:00 น.",
    courseCode: "CS-301-001",
    courseName: "การออกแบบและวิเคราะห์ขั้นตอนวิธีขั้นสูง",
    type: "ปลายภาค (Final)",
    room: "ห้อง 401 อาคาร 4",
    seat: "ที่นั่ง A-12",
  },
  {
    date: "22 ธ.ค. 2569",
    time: "13:30 - 16:30 น.",
    courseCode: "CS-302-001",
    courseName: "สถาปัตยกรรมระบบคลาวด์และไมโครเซอร์วิส",
    type: "ปลายภาค (Final)",
    room: "ห้อง 305 อาคาร 3",
    seat: "ที่นั่ง B-08",
  },
]

const courseCatalog: CourseSection[] = [
  {
    id: "cs-301",
    code: "CS-301-001",
    nameTh: "การออกแบบและวิเคราะห์ขั้นตอนวิธีขั้นสูง",
    nameEn: "Advanced Algorithm Design & Analysis",
    credits: 3,
    section: "01",
    instructor: "รศ.ดร. นันทิกร วิเศษสุข",
    schedule: "จันทร์ 09:00 - 12:00",
    room: "Lab Com 401",
    enrolled: 42,
    capacity: 45,
    prereq: "CS-201 Data Structures",
  },
  {
    id: "cs-302",
    code: "CS-302-001",
    nameTh: "สถาปัตยกรรมระบบคลาวด์และไมโครเซอร์วิส",
    nameEn: "Cloud Architecture & Microservices",
    credits: 3,
    section: "01",
    instructor: "ผศ.ดร. ภาณุพงศ์ วงศ์สวรรค์",
    schedule: "อังคาร 13:00 - 16:00",
    room: "Lab Com 305",
    enrolled: 38,
    capacity: 40,
    prereq: "CS-202 Operating Systems",
  },
  {
    id: "cs-303",
    code: "CS-303-002",
    nameTh: "ความมั่นคงปลอดภัยสารสนเทศและกฎหมาย PDPA",
    nameEn: "Information Security & PDPA Governance",
    credits: 3,
    section: "02",
    instructor: "ดร. เอกชัย ปกป้อง",
    schedule: "พุธ 09:00 - 12:00",
    room: "Auditorium 2",
    enrolled: 55,
    capacity: 60,
  },
  {
    id: "gen-201",
    code: "GEN-201-003",
    nameTh: "ภาษาอังกฤษเชิงวิชาการและการนำเสนอผลงาน",
    nameEn: "English for Academic Presentation",
    credits: 3,
    section: "03",
    instructor: "อ. จอห์นสัน แอนเดอร์สัน",
    schedule: "พฤหัสบดี 13:00 - 16:00",
    room: "LC 204",
    enrolled: 30,
    capacity: 35,
  },
]

export default function SisPortalPage() {
  const [activeTab, setActiveTab] = useState<"register" | "grades" | "petitions" | "schedule">("register")
  const [enrolledIds, setEnrolledIds] = useState<string[]>(["cs-301", "cs-302"])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [showTuitionModal, setShowTuitionModal] = useState(false)
  const [showTranscriptModal, setShowTranscriptModal] = useState(false)
  const [showNewPetitionModal, setShowNewPetitionModal] = useState(false)
  const [scheduleView, setScheduleView] = useState<"weekly" | "exam">("weekly")
  const [petitions, setPetitions] = useState<PetitionItem[]>(initialPetitions)
  const [newPetType, setNewPetType] = useState("ขอหนังสือรับรองสถานภาพนักศึกษา (Student Status)")
  const [newPetReason, setNewPetReason] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      if (tabParam && ["register", "grades", "petitions", "schedule"].includes(tabParam)) {
        setActiveTab(tabParam as typeof activeTab)
      }
    }
  }, [])

  const toggleEnroll = (course: CourseSection) => {
    if (enrolledIds.includes(course.id)) {
      setEnrolledIds(enrolledIds.filter((id) => id !== course.id))
      setAlertMessage(`ถอนรายวิชา ${course.code} เรียบร้อยแล้ว (คืนที่นั่งสู่ระบบ)`)
    } else {
      if (course.enrolled >= course.capacity) {
        setAlertMessage(`ไม่สามารถลงทะเบียนได้: ที่นั่งรายวิชา ${course.code} เต็มแล้ว`)
        return
      }
      setEnrolledIds([...enrolledIds, course.id])
      setAlertMessage(`ลงทะเบียนสำเร็จ: ${course.code} (Atomic Seat Locked เรียบร้อย)`)
    }
    setTimeout(() => setAlertMessage(null), 4000)
  }

  const handleNewPetitionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetReason.trim()) return

    const newPet: PetitionItem = {
      id: `pet-${Date.now()}`,
      petitionNumber: `REQ-2569-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${newPetType.split(" (")[0]} (ยื่นคำร้องผ่านระบบออนไลน์)`,
      type: newPetType,
      term: "1/2569",
      submittedAt: "วันนี้ เพิ่งยื่นเรื่อง",
      reason: newPetReason,
      status: "pending_advisor",
      currentStep: "ขั้นตอนที่ 1/3: รออาจารย์ที่ปรึกษาพิจารณา",
      advisor: "ดร. วิชัย มุ่งมั่น",
    }
    setPetitions([newPet, ...petitions])
    setShowNewPetitionModal(false)
    setNewPetReason("")
    setAlertMessage(`ยื่นคำร้อง ${newPet.petitionNumber} เรียบร้อยแล้ว (ระบบส่งแจ้งเตือนให้อาจารย์ที่ปรึกษาแล้ว)`)
    setTimeout(() => setAlertMessage(null), 4000)
  }

  const enrolledCourses = courseCatalog.filter((c) => enrolledIds.includes(c.id))
  const currentTotalCredits = enrolledCourses.reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 bg-surface-card/95 backdrop-blur-md shadow-xs border-b border-border-subtle">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-1.5 text-secondary hover:text-navy-deep font-label-md text-label-md transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>กลับหน้าหลักบริการ</span>
            </Link>
            <span className="text-outline-variant">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary text-surface-card flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">school</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Core SIS Portal
                </span>
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant ml-2">
                  ระบบบริการการศึกษาและทะเบียน (M02)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              ภาคเรียนที่ 1/2568
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="w-full bg-surface-canvas flex-1 pb-space-3xl">
        {/* Top Notification Ribbon */}
        <div className="w-full bg-amber-subtle text-on-surface py-space-xs px-gutter-mobile lg:px-gutter-desktop shadow-xs border-b border-amber-200/50">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-xs font-label-md text-label-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-amber-primary text-base animate-pulse">campaign</span>
              <span className="font-bold text-amber-primary">[ประกาศด่วน M02-REG]</span>
              <span className="text-on-surface">เปิดระบบลงทะเบียนเรียนภาคการศึกษา 1/2568: สิ้นสุด 31 มี.ค. 2568</span>
              <span className="hidden md:inline text-outline-variant">•</span>
              <span className="hidden md:inline font-semibold text-secondary">ระบบพร้อมให้บริการ Atomic Seat Locking</span>
            </div>
            <span className="text-xs text-outline">อัปเดตสถานะแบบ Real-time</span>
          </div>
        </div>

        {/* Academic Profile & Institutional Identity Sub-bar */}
        <div className="w-full bg-surface-card shadow-xs border-b border-border-subtle">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
              {/* Student Info Core */}
              <div className="flex items-center gap-space-md min-w-0">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-navy-deep text-amber-primary flex items-center justify-center font-bold text-2xl shadow-sm border border-navy-surface">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-status-success text-surface-card text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    ปกติ
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                      นายธนภัทร สิริวัฒนกุล
                    </span>
                    <span className="bg-surface-container-high text-primary px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold">
                      รหัส: 653040128-9
                    </span>
                    <span className="bg-blue-subtle text-secondary px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Active Student
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                    <span>หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ (ชั้นปีที่ 3)</span>
                    <span>•</span>
                    <span>คณะวิทยาการสารสนเทศและการคำนวณ</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-secondary">school</span>
                      อ.ที่ปรึกษา: รศ.ดร. นันทิกร วิเศษสุข
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic KPIs Bento Strip */}
              <div className="flex items-stretch gap-space-sm w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0">
                <div className="bg-surface-canvas p-space-sm rounded-xl min-w-[130px] flex-1 xl:flex-none flex flex-col justify-between shadow-xs border border-border-subtle">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">เกรดเฉลี่ยสะสม</span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-primary">3.68</span>
                    <span className="font-label-sm text-label-sm text-status-success font-semibold">เกียรตินิยม</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">GPAX สะสม 5 ภาค</span>
                </div>

                <div className="bg-surface-canvas p-space-sm rounded-xl min-w-[150px] flex-1 xl:flex-none flex flex-col justify-between shadow-xs border border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">หน่วยกิตสะสม</span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">68.6%</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary">92</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">/ 134 นก.</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-[68.6%]"></div>
                  </div>
                </div>

                <div className="bg-surface-canvas p-space-sm rounded-xl min-w-[140px] flex-1 xl:flex-none flex flex-col justify-between shadow-xs border border-border-subtle">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">ชั่วโมงกิจกรรม</span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary">64</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">/ 60 ชม.</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-status-success font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    ผ่านเกณฑ์สำเร็จการศึกษา
                  </span>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded-xl min-w-[140px] flex-1 xl:flex-none flex flex-col justify-between border border-secondary/20">
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">สิทธิ์ลงทะเบียน</span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="font-headline-lg text-headline-lg font-bold text-secondary">22</span>
                    <span className="font-label-md text-label-md text-secondary">หน่วยกิตสูงสุด</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">ไม่มีหนี้ค้างชำระ</span>
                </div>
              </div>
            </div>

            {/* Functional Navigation Tabs */}
            <div className="flex items-center gap-space-xs overflow-x-auto mt-space-lg pt-space-xs">
              {[
                { id: "register", label: "แผนการเรียน & ลงทะเบียน (M02-F01)", icon: "how_to_reg" },
                { id: "grades", label: "ประวัติผลการเรียน & Transcript (M02-F02/F03)", icon: "grade" },
                { id: "petitions", label: "ยื่นคำร้อง e-Petition (M02-F04)", icon: "assignment" },
                { id: "schedule", label: "ตารางเรียน/ตารางสอบ (M02-F05)", icon: "calendar_month" },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-space-md py-space-xs rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl">
          {/* Toast Alert */}
          {alertMessage && (
            <div className="bg-navy-deep text-surface-card px-space-md py-space-sm rounded-xl shadow-md border border-navy-surface flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-amber-primary">info</span>
                <span className="font-label-md text-label-md">{alertMessage}</span>
              </div>
              <button onClick={() => setAlertMessage(null)} className="text-surface-container-high hover:text-surface-card">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Enrolled Summary Banner (Register Tab) */}
          {activeTab === "register" && (
            <>
              <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-blue-subtle text-secondary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                      สถานะการลงทะเบียนประจำภาค 1/2569
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      ลงทะเบียนแล้ว {enrolledCourses.length} รายวิชา รวมทั้งสิ้น <strong className="text-secondary">{currentTotalCredits}</strong> / 22 หน่วยกิต
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm">
                  <button
                    onClick={() => setShowTuitionModal(true)}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                    <span>พิมพ์ใบลงทะเบียน</span>
                  </button>
                  <button
                    onClick={() => {
                      setAlertMessage("ยืนยันแผนการเรียนและล็อกที่นั่ง (Atomic Seat Locked) เสร็จสมบูรณ์")
                      setTimeout(() => setAlertMessage(null), 4000)
                    }}
                    className="px-space-md py-2 rounded-lg bg-primary hover:bg-navy-deep text-surface-card font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>ยืนยันการลงทะเบียน</span>
                  </button>
                </div>
              </div>

              {/* Course Catalog Grid */}
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      M02-F01 Course Catalog
                    </span>
                    <h3 className="font-headline-md text-headline-md text-navy-deep font-bold">
                      รายวิชาที่เปิดสอนสำหรับหลักสูตร วท.บ. วิทยาการคอมพิวเตอร์
                    </h3>
                  </div>
                  <span className="text-xs text-outline">รองรับระบบล็อกที่นั่งอัตโนมัติ (Atomic Seat Locking)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {courseCatalog.map((course) => {
                    const isEnrolled = enrolledIds.includes(course.id)
                    const isFull = course.enrolled >= course.capacity
                    return (
                      <div
                        key={course.id}
                        className={`bg-surface-card p-space-lg rounded-xl shadow-xs border transition-all flex flex-col justify-between ${
                          isEnrolled
                            ? "border-secondary ring-1 ring-secondary/30"
                            : "border-border-subtle hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-space-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                  {course.code}
                                </span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                                  ตอน {course.section}
                                </span>
                              </div>
                              <h4 className="font-bold text-navy-deep text-base mt-1">
                                {course.nameTh}
                              </h4>
                              <div className="text-xs text-on-surface-variant font-medium">
                                {course.nameEn}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-secondary bg-blue-subtle px-2.5 py-1 rounded-lg shrink-0">
                              {course.credits} นก.
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-on-surface-variant pt-2 border-t border-border-subtle/60">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-outline">person</span>
                              <span>{course.instructor}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-outline">schedule</span>
                              <span>{course.schedule}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-outline">meeting_room</span>
                              <span>{course.room}</span>
                            </div>
                            {course.prereq && (
                              <div className="flex items-center gap-1.5 text-amber-primary font-medium">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                <span>รายวิชาบังคับก่อน: {course.prereq}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-space-md mt-space-md border-t border-border-subtle flex items-center justify-between gap-2">
                          <div className="text-xs">
                            <span className="text-outline">ที่นั่ง: </span>
                            <span className={`font-bold ${isFull ? "text-status-danger" : "text-status-success"}`}>
                              {course.enrolled + (isEnrolled ? 1 : 0)} / {course.capacity}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleEnroll(course)}
                            className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                              isEnrolled
                                ? "bg-red-50 hover:bg-red-100 text-status-danger border border-red-200"
                                : isFull
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-primary hover:bg-navy-deep text-surface-card shadow-xs"
                            }`}
                            disabled={!isEnrolled && isFull}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {isEnrolled ? "remove_circle" : "add_circle"}
                            </span>
                            <span>{isEnrolled ? "ถอนรายวิชา" : "ลงทะเบียนวิชานี้"}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Grades & Academic History */}
          {activeTab === "grades" && (
            <div className="space-y-space-xl">
              {/* Transcript Action Banner */}
              <div className="bg-surface-card p-space-lg rounded-2xl shadow-xs border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                      M02-F02 / M02-F03 Official Academic Record
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      ทรานสคริปต์ดิจิทัลรับรองผล
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-navy-deep font-bold">
                    ประวัติผลการศึกษาและทรานสคริปต์อิเล็กทรอนิกส์
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (หลักสูตรปรับปรุง พ.ศ. 2565)
                  </p>
                </div>

                <button
                  onClick={() => setShowTranscriptModal(true)}
                  className="px-space-lg py-2.5 rounded-xl bg-primary hover:bg-navy-deep text-surface-card font-label-md text-label-md font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">school</span>
                  <span>เปิด e-Transcript ฉบับทางการ</span>
                </button>
              </div>

              {/* Terms Breakdown */}
              <div className="space-y-space-lg">
                {academicHistory.map((termItem) => (
                  <div key={termItem.term} className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
                    <div className="bg-surface-container-low px-space-lg py-space-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">calendar_today</span>
                        <h4 className="font-bold text-navy-deep text-base">{termItem.term}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span>หน่วยกิตประจำภาค: <strong className="text-navy-deep">{termItem.termCredits} นก.</strong></span>
                        <span>GPA ประจำภาค: <strong className="text-secondary font-mono text-sm">{termItem.termGpa.toFixed(2)}</strong></span>
                        <span>GPAX สะสม: <strong className="text-primary font-mono text-sm">{termItem.cumulativeGpa.toFixed(2)}</strong></span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-surface-container/50 text-on-surface-variant border-b border-border-subtle">
                          <tr>
                            <th className="py-2.5 px-4 font-bold">รหัสวิชา</th>
                            <th className="py-2.5 px-4 font-bold">ชื่อรายวิชา</th>
                            <th className="py-2.5 px-4 font-bold text-center">หน่วยกิต</th>
                            <th className="py-2.5 px-4 font-bold text-center">ผลการเรียน (Grade)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                          {termItem.courses.map((course) => (
                            <tr key={course.code} className="hover:bg-surface-container-low/40">
                              <td className="py-2.5 px-4 font-mono font-bold text-primary">{course.code}</td>
                              <td className="py-2.5 px-4 font-medium text-navy-deep">{course.nameTh}</td>
                              <td className="py-2.5 px-4 text-center">{course.credits}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span
                                  className={`inline-block w-8 py-0.5 rounded text-xs font-mono font-extrabold ${
                                    course.grade === "A"
                                      ? "bg-status-success/20 text-status-success"
                                      : course.grade.startsWith("B")
                                      ? "bg-blue-subtle text-secondary"
                                      : course.grade === "S"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-amber-subtle text-amber-800"
                                  }`}
                                >
                                  {course.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: e-Petitions */}
          {activeTab === "petitions" && (
            <div className="space-y-space-xl">
              {/* Petitions Header Banner */}
              <div className="bg-surface-card p-space-lg rounded-2xl shadow-xs border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="space-y-1">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    M02-F04 Student E-Petition Portal
                  </span>
                  <h3 className="font-headline-md text-headline-md text-navy-deep font-bold">
                    คำร้องออนไลน์และติดตามสถานะการอนุมัติ
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    ยื่นคำร้องทางวิชาการและติดตามขั้นตอนการพิจารณาของอาจารย์ที่ปรึกษา หัวหน้าสาขาวิชา และคณบดี
                  </p>
                </div>

                <button
                  onClick={() => setShowNewPetitionModal(true)}
                  className="px-space-lg py-2.5 rounded-xl bg-amber-primary hover:bg-amber-600 text-surface-card font-label-md text-label-md font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">post_add</span>
                  <span>ยื่นคำร้องใหม่</span>
                </button>
              </div>

              {/* Petitions List */}
              <div className="space-y-space-md">
                {petitions.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-surface-card p-space-lg rounded-2xl border border-border-subtle shadow-xs hover:border-secondary/30 transition-all space-y-space-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          {pet.petitionNumber}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant">
                          ภาคเรียน {pet.term} • ยื่นเมื่อ {pet.submittedAt}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 w-fit ${
                          pet.status === "approved"
                            ? "bg-status-success/15 text-status-success"
                            : pet.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-subtle text-amber-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {pet.status === "approved" ? "task_alt" : "hourglass_top"}
                        </span>
                        <span>{pet.currentStep}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-navy-deep text-base">{pet.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        <strong>เหตุผล:</strong> {pet.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-subtle/70 flex items-center justify-between text-xs text-on-surface-variant">
                      <span>อาจารย์ที่ปรึกษาผู้รับผิดชอบ: <strong>{pet.advisor}</strong></span>
                      <span className="text-secondary font-semibold flex items-center gap-1 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>ดูบันทึกขั้นตอน</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Schedule & Exam Timetable */}
          {activeTab === "schedule" && (
            <div className="space-y-space-xl">
              {/* Schedule Switcher Header */}
              <div className="bg-surface-card p-space-lg rounded-2xl shadow-xs border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="space-y-1">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    M02-F05 Schedules & Examination
                  </span>
                  <h3 className="font-headline-md text-headline-md text-navy-deep font-bold">
                    ตารางเรียนและตารางสอบประจำภาคการศึกษา 1/2569
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    ข้อมูลเวลาเรียน ห้องเรียน อาคาร และเลขที่นั่งสอบประจำรายวิชาที่ลงทะเบียน
                  </p>
                </div>

                <div className="flex items-center gap-space-sm shrink-0">
                  <div className="bg-surface-container p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setScheduleView("weekly")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        scheduleView === "weekly" ? "bg-primary text-white shadow-xs" : "text-on-surface-variant hover:text-navy-deep"
                      }`}
                    >
                      ตารางเรียนประจำสัปดาห์
                    </button>
                    <button
                      onClick={() => setScheduleView("exam")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        scheduleView === "exam" ? "bg-primary text-white shadow-xs" : "text-on-surface-variant hover:text-navy-deep"
                      }`}
                    >
                      ตารางสอบไล่
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setAlertMessage("ส่งออกไฟล์ปฏิทิน iCal สำเร็จ (ซิงค์ข้อมูลเข้า Google/Apple Calendar เรียบร้อย)")
                      setTimeout(() => setAlertMessage(null), 4000)
                    }}
                    className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    <span>ส่งออก iCal</span>
                  </button>
                </div>
              </div>

              {/* View 1: Weekly Timetable */}
              {scheduleView === "weekly" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {weeklySchedule.map((block) => (
                    <div
                      key={block.courseCode}
                      className={`p-space-lg rounded-2xl border-l-4 shadow-xs bg-surface-card border border-border-subtle ${block.color}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80">
                            วัน{block.dayTh} ({block.dayEn})
                          </span>
                          <h4 className="font-bold text-navy-deep text-base mt-2">
                            {block.courseName}
                          </h4>
                          <span className="font-mono text-xs font-bold text-primary">
                            {block.courseCode} • {block.section}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-2xl text-secondary">
                          schedule
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-subtle/50 space-y-1 text-xs text-on-surface">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-outline">alarm</span>
                          <span><strong>เวลาเรียน:</strong> {block.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                          <span><strong>ห้องเรียน:</strong> {block.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-outline">person</span>
                          <span><strong>ผู้สอน:</strong> {block.instructor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Exam Schedule */}
              {scheduleView === "exam" && (
                <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-border-subtle">
                        <tr>
                          <th className="py-3 px-4">วันและเวลาสอบ</th>
                          <th className="py-3 px-4">รหัสและชื่อวิชา</th>
                          <th className="py-3 px-4 text-center">ประเภทการสอบ</th>
                          <th className="py-3 px-4">ห้องสอบ</th>
                          <th className="py-3 px-4 text-center">เลขที่นั่งสอบ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {examSchedule.map((exam, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/40">
                            <td className="py-3 px-4 font-semibold text-navy-deep">
                              <div>{exam.date}</div>
                              <div className="text-outline text-[11px]">{exam.time}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-primary block">{exam.courseCode}</span>
                              <span className="text-navy-deep font-medium">{exam.courseName}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  exam.type.includes("Midterm")
                                    ? "bg-amber-subtle text-amber-800"
                                    : "bg-blue-subtle text-secondary"
                                }`}
                              >
                                {exam.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-on-surface">{exam.room}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-primary">{exam.seat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Tuition & Registration Invoice Modal */}
      {showTuitionModal && (
        <div className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card rounded-2xl max-w-2xl w-full shadow-2xl border border-border-subtle overflow-hidden">
            {/* Modal Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-primary text-2xl">receipt_long</span>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-white leading-tight">
                    ใบแจ้งการชำระเงินค่าเล่าเรียนและใบลงทะเบียนเรียน
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    Semester 1/2569 • Academic Enrollment Invoice (M02-F06)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTuitionModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto">
              {/* Institution & Student Info */}
              <div className="border-b border-border-subtle pb-space-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-bold text-navy-deep text-base">วิทยาลัยสารสนเทศและเทคโนโลยี</h4>
                  <p className="text-xs text-on-surface-variant">สำนักส่งเสริมวิชาการและงานทะเบียน (REGISTRAR OFFICE)</p>
                </div>
                <div className="text-left sm:text-right text-xs text-on-surface-variant">
                  <p className="font-mono font-bold text-navy-deep">เลขที่ใบแจ้งหนี้: INV-2569-09412</p>
                  <p>วันที่ออก: 6 กันยายน 2569</p>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="bg-surface-container-low p-space-md rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-outline block">รหัสนักศึกษา:</span>
                  <span className="font-mono font-bold text-navy-deep">6601101234</span>
                </div>
                <div>
                  <span className="text-outline block">ชื่อ-นามสกุล:</span>
                  <span className="font-bold text-navy-deep">นายสมชาย ใจดี</span>
                </div>
                <div>
                  <span className="text-outline block">คณะ/สาขา:</span>
                  <span className="text-navy-deep">คณะวิทยาการสารสนเทศ</span>
                </div>
                <div>
                  <span className="text-outline block">สถานะชำระ:</span>
                  <span className="font-bold text-amber-primary">รอการชำระเงิน</span>
                </div>
              </div>

              {/* Course List Table */}
              <div className="border border-border-subtle rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container text-on-surface-variant font-bold border-b border-border-subtle">
                    <tr>
                      <th className="py-2.5 px-3">รหัสวิชา</th>
                      <th className="py-2.5 px-3">ชื่อรายวิชา</th>
                      <th className="py-2.5 px-3 text-center">ตอน</th>
                      <th className="py-2.5 px-3 text-center">หน่วยกิต</th>
                      <th className="py-2.5 px-3 text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {courseCatalog
                      .filter((c) => enrolledIds.includes(c.id))
                      .map((course) => (
                        <tr key={course.id} className="hover:bg-surface-container-low/50">
                          <td className="py-2 px-3 font-mono font-bold text-primary">{course.code}</td>
                          <td className="py-2 px-3 font-medium text-navy-deep">{course.nameTh}</td>
                          <td className="py-2 px-3 text-center font-mono">{course.section}</td>
                          <td className="py-2 px-3 text-center font-bold">{course.credits}</td>
                          <td className="py-2 px-3 text-right font-mono">{(course.credits * 2500).toLocaleString()}.00</td>
                        </tr>
                      ))}
                    <tr className="bg-surface-container-low font-bold text-navy-deep">
                      <td colSpan={3} className="py-2.5 px-3 text-right">ค่าบำรุงการศึกษาและระบบดิจิทัลสถาบัน:</td>
                      <td className="py-2.5 px-3 text-center">-</td>
                      <td className="py-2.5 px-3 text-right font-mono">3,500.00</td>
                    </tr>
                    <tr className="bg-primary/10 font-bold text-primary text-sm">
                      <td colSpan={3} className="py-3 px-3 text-right">ยอดรวมสุทธิที่ต้องชำระ (Total Amount):</td>
                      <td className="py-3 px-3 text-center">
                        {courseCatalog.filter((c) => enrolledIds.includes(c.id)).reduce((sum, c) => sum + c.credits, 0)} นก.
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-base">
                        {(
                          courseCatalog.filter((c) => enrolledIds.includes(c.id)).reduce((sum, c) => sum + c.credits * 2500, 0) +
                          3500
                        ).toLocaleString()}
                        .00 บาท
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Barcode / QR Section */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-dashed border-outline/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-navy-deep text-white font-bold text-[10px]">
                      Thai QR Payment / PromptPay
                    </span>
                    <span className="text-outline">Cross-bank Payment</span>
                  </div>
                  <p className="font-mono text-[11px] text-on-surface">Ref 1 (รหัสนักศึกษา): <strong>6601101234</strong></p>
                  <p className="font-mono text-[11px] text-on-surface">Ref 2 (รหัสชำระ): <strong>256901009412</strong></p>
                  <p className="text-[11px] text-outline">กำหนดชำระเงินภายใน: 25 กันยายน 2569</p>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-border-subtle shadow-xs">
                  <span className="material-symbols-outlined text-5xl text-navy-deep">qr_code_2</span>
                  <span className="text-[10px] font-bold text-navy-deep">สแกนเพื่อจ่ายเงิน</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setShowTuitionModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  window.print()
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>พิมพ์ใบแจ้งหนี้</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official e-Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl shadow-2xl border border-border-subtle max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-primary/20 text-amber-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-surface-card font-bold">
                    Official e-Transcript (ใบรายงานผลการศึกษาดิจิทัล)
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    รับรองความถูกต้องด้วยลายมือชื่ออิเล็กทรอนิกส์ตาม พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="text-surface-container-high hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto">
              {/* Security Seal Banner */}
              <div className="p-space-md bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-3xl">verified</span>
                  <div>
                    <h5 className="font-bold text-navy-deep text-sm">e-Transcript Authenticity Verified</h5>
                    <p className="text-xs text-on-surface-variant font-mono">
                      SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
                    setAlertMessage("คัดลอก Cryptographic Hash เรียบร้อยแล้ว")
                    setTimeout(() => setAlertMessage(null), 3000)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-500/30 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-xs">content_copy</span>
                  <span>คัดลอก Hash</span>
                </button>
              </div>

              {/* Student Metadata Card */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-outline block">รหัสนักศึกษา:</span>
                  <span className="font-mono font-bold text-navy-deep text-sm">6601101234</span>
                </div>
                <div>
                  <span className="text-outline block">ชื่อ-นามสกุล:</span>
                  <span className="font-bold text-navy-deep">นายสมชาย ใจดี</span>
                  <span className="block text-[11px] text-outline">Mr. Somchai Jaidee</span>
                </div>
                <div>
                  <span className="text-outline block">หลักสูตร / คณะ:</span>
                  <span className="font-medium text-navy-deep">วท.บ. วิทยาการคอมพิวเตอร์</span>
                  <span className="block text-[11px] text-outline">คณะวิทยาการสารสนเทศ</span>
                </div>
                <div>
                  <span className="text-outline block">สถานภาพ / เกียรตินิยม:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    เกียรตินิยมอันดับ 1
                  </span>
                </div>
              </div>

              {/* Course Record Table */}
              <div className="space-y-space-md">
                {academicHistory.map((history) => (
                  <div key={history.term} className="border border-border-subtle rounded-xl overflow-hidden">
                    <div className="bg-surface-container px-space-md py-2 flex items-center justify-between border-b border-border-subtle">
                      <span className="font-bold text-navy-deep text-xs">{history.term}</span>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span>GPA: <strong className="text-navy-deep">{history.termGpa.toFixed(2)}</strong></span>
                        <span>GPAX: <strong className="text-secondary">{history.cumulativeGpa.toFixed(2)}</strong></span>
                      </div>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container-low text-on-surface-variant font-semibold border-b border-border-subtle">
                        <tr>
                          <th className="py-2 px-3">รหัสวิชา</th>
                          <th className="py-2 px-3">ชื่อรายวิชา</th>
                          <th className="py-2 px-3 text-center">หน่วยกิต</th>
                          <th className="py-2 px-3 text-center">เกรด</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {history.courses.map((c) => (
                          <tr key={c.code} className="hover:bg-surface-container-low/50">
                            <td className="py-2 px-3 font-mono font-bold text-primary">{c.code}</td>
                            <td className="py-2 px-3 text-navy-deep">{c.nameTh}</td>
                            <td className="py-2 px-3 text-center">{c.credits}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-navy-deep">{c.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Digital Seal & QR Footer */}
              <div className="p-space-md rounded-xl bg-surface-container-low border border-dashed border-outline/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-navy-deep">สำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยสารสนเทศ</p>
                  <p className="text-outline text-[11px]">Certified PDF with PAdES Digital Signature (Adobe Approved Trust List)</p>
                  <p className="text-[11px] text-outline">ตรวจสอบความถูกต้องได้ที่: https://registrar.college.ac.th/verify</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-border-subtle flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-navy-deep">qr_code_2</span>
                    <span className="text-[9px] font-mono text-outline">VERIFY DOC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                ปิด
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>พิมพ์ / บันทึก Official e-Transcript</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New e-Petition Submission Modal */}
      {showNewPetitionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl shadow-2xl border border-border-subtle max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-primary/20 text-amber-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">post_add</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-surface-card font-bold">
                    ยื่นคำร้องออนไลน์ (New e-Petition)
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    คำร้องจะถูกส่งเข้าสู่ระบบ Approval Workflow ดิจิทัลโดยอัตโนมัติ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewPetitionModal(false)}
                className="text-surface-container-high hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleNewPetitionSubmit}>
              <div className="p-space-lg space-y-space-md max-h-[70vh] overflow-y-auto">
                {/* Petition Type */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-navy-deep font-bold block">
                    ประเภทคำร้องวิชาการ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPetType}
                    onChange={(e) => setNewPetType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface-canvas text-navy-deep text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="ขอหนังสือรับรองสถานภาพนักศึกษา (Student Status Certificate)">
                      ขอหนังสือรับรองสถานภาพนักศึกษา (Student Status Certificate)
                    </option>
                    <option value="ขอเพิ่ม/ถอนรายวิชาล่าช้ากรณีพิเศษ (Late Add/Drop Petition)">
                      ขอเพิ่ม/ถอนรายวิชาล่าช้ากรณีพิเศษ (Late Add/Drop Petition)
                    </option>
                    <option value="ขอลาพักการศึกษาชั่วคราว (Leave of Absence Petition)">
                      ขอลาพักการศึกษาชั่วคราว (Leave of Absence Petition)
                    </option>
                    <option value="ขอเทียบโอนรายวิชาและหน่วยกิต (Credit Transfer Petition)">
                      ขอเทียบโอนรายวิชาและหน่วยกิต (Credit Transfer Petition)
                    </option>
                    <option value="ขอลงทะเบียนเรียนเกินหน่วยกิตกำหนด (Overload Credits Petition)">
                      ขอลงทะเบียนเรียนเกินหน่วยกิตกำหนด (Overload Credits Petition)
                    </option>
                  </select>
                </div>

                {/* Term & Student */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface-container-low rounded-lg">
                    <span className="text-outline block">ภาคการศึกษาที่ยื่น:</span>
                    <span className="font-bold text-navy-deep">1/2569</span>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-lg">
                    <span className="text-outline block">อาจารย์ที่ปรึกษาผู้พิจารณา:</span>
                    <span className="font-bold text-navy-deep">ดร. วิชัย มุ่งมั่น</span>
                  </div>
                </div>

                {/* Reason / Details */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-navy-deep font-bold block">
                    เหตุผลและความจำเป็นในการยื่นคำร้อง <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newPetReason}
                    onChange={(e) => setNewPetReason(e.target.value)}
                    placeholder="ระบุรายละเอียด เช่น เพื่อนำไปใช้เป็นหลักฐานการสมัครขอรับทุนการศึกษา หรือเหตุผลความจำเป็นในการลงทะเบียนล่าช้า..."
                    className="w-full p-3 rounded-lg border border-border-subtle bg-surface-canvas text-navy-deep text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-outline"
                  ></textarea>
                </div>

                {/* Upload Attachment Mockup */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-navy-deep font-bold block">
                    แนบเอกสารหลักฐานเพิ่มเติม (ถ้ามี)
                  </label>
                  <div className="border border-dashed border-border-subtle rounded-xl p-4 bg-surface-container-low/50 text-center hover:bg-surface-container-low cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-3xl text-secondary">upload_file</span>
                    <p className="text-xs text-navy-deep font-medium mt-1">คลิกหรือลากไฟล์เอกสารมาวางที่นี่</p>
                    <p className="text-[11px] text-outline">รองรับ PDF, PNG, JPG (ขนาดไม่เกิน 10MB)</p>
                  </div>
                </div>

                {/* Notice */}
                <div className="p-3 rounded-lg bg-blue-subtle/50 text-secondary text-xs flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                  <span>ระบบจะส่งการแจ้งเตือนไปยังอาจารย์ที่ปรึกษาเพื่อพิจารณาลงนามอิเล็กทรอนิกส์ในลำดับแรก</span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
                <button
                  type="button"
                  onClick={() => setShowNewPetitionModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>ยื่นคำร้อง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-md border-t border-navy-surface mt-auto">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-primary-fixed-dim">
          <span>College SIS 2.4 • Student Information System Portal</span>
          <span>&copy; 2569 สำนักส่งเสริมวิชาการและงานทะเบียน</span>
        </div>
      </footer>
    </div>
  )
}
