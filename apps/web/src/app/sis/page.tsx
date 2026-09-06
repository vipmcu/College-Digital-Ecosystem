'use client'

import React, { useState } from "react"
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

          {/* Enrolled Summary Banner */}
          <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-blue-subtle text-secondary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                  สถานะการลงทะเบียนประจำภาค 1/2568
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
                          <span className="bg-surface-container text-secondary font-mono font-bold text-xs px-2 py-0.5 rounded">
                            {course.code}
                          </span>
                          <h4 className="font-headline-sm text-headline-sm text-navy-deep font-bold mt-1">
                            {course.nameTh}
                          </h4>
                          <p className="text-xs text-on-surface-variant font-medium">{course.nameEn}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-surface-container-low text-secondary font-bold text-xs rounded-full">
                          {course.credits} หน่วยกิต
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-surface-container-low p-space-sm rounded-lg">
                        <div>
                          <span className="text-slate-400 block">อาจารย์ผู้สอน:</span>
                          <span className="font-medium text-navy-deep">{course.instructor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">วัน-เวลาเรียน:</span>
                          <span className="font-medium text-navy-deep">{course.schedule}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">ห้องเรียน:</span>
                          <span className="font-medium text-navy-deep">{course.room}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">ที่นั่งลงทะเบียน:</span>
                          <span className={`font-bold ${isFull ? "text-status-danger" : "text-status-success"}`}>
                            {course.enrolled} / {course.capacity} ที่นั่ง
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-space-md flex items-center justify-between border-t border-border-subtle mt-space-md">
                      <div className="text-xs">
                        {isEnrolled ? (
                          <span className="text-status-success font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            ลงทะเบียนแล้ว
                          </span>
                        ) : isFull ? (
                          <span className="text-status-danger font-semibold">ที่นั่งเต็มแล้ว</span>
                        ) : (
                          <span className="text-slate-400">พร้อมลงทะเบียน</span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleEnroll(course)}
                        className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
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
