'use client'

import React, { useState } from "react"
import Link from "next/link"

interface LmsCourseItem {
  id: string
  code: string
  nameTh: string
  nameEn: string
  instructor: string
  progress: number
  totalModules: number
  completedModules: number
  nextLiveSession: string
  meetingUrl: string
  accentColor: string
}

interface MaterialItem {
  id: string
  courseCode: string
  title: string
  type: 'video' | 'pdf' | 'slide'
  sizeOrDuration: string
  uploadDate: string
}

interface AssignmentItem {
  id: string
  courseCode: string
  title: string
  dueDate: string
  dueCountdown: string
  maxScore: number
  submittedScore?: number
  status: 'PENDING' | 'SUBMITTED' | 'GRADED'
  feedback?: string
}

interface QuizItem {
  id: string
  courseCode: string
  title: string
  durationMinutes: number
  totalQuestions: number
  maxScore: number
  status: 'OPEN' | 'COMPLETED'
  score?: number
}

const initialCourses: LmsCourseItem[] = [
  {
    id: "lms-c1",
    code: "CS-301-001",
    nameTh: "ระบบฐานข้อมูลและการออกแบบสถาปัตยกรรมข้อมูล",
    nameEn: "Database Systems & Data Architecture",
    instructor: "ผศ.ดร. ธีรศักดิ์ สุวรรณรัตน์",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    nextLiveSession: "วันพุธ 13:00 - 15:00 น. (ห้องบรรยายออนไลน์ A1)",
    meetingUrl: "https://meet.college.ac.th/cs301",
    accentColor: "from-blue-600 to-indigo-700",
  },
  {
    id: "lms-c2",
    code: "CS-302-001",
    nameTh: "วิศวกรรมซอฟต์แวร์และการทดสอบระบบอัตโนมัติ",
    nameEn: "Software Engineering & Automated Testing",
    instructor: "ดร. กานดา วัฒนพงษ์",
    progress: 60,
    totalModules: 10,
    completedModules: 6,
    nextLiveSession: "วันศุกร์ 09:00 - 12:00 น. (ห้องแล็บปฏิบัติการ SC-304)",
    meetingUrl: "https://meet.college.ac.th/cs302",
    accentColor: "from-emerald-600 to-teal-700",
  },
  {
    id: "lms-c3",
    code: "CS-303-001",
    nameTh: "ความมั่นคงปลอดภัยระบบเครือข่ายและไซเบอร์",
    nameEn: "Computer Networks & Cyber Defense",
    instructor: "อ. สมชาย เกียรติสกุล",
    progress: 40,
    totalModules: 10,
    completedModules: 4,
    nextLiveSession: "วันพฤหัสบดี 13:00 - 16:00 น. (Lab Cyber Hub)",
    meetingUrl: "https://meet.college.ac.th/cs303",
    accentColor: "from-amber-600 to-orange-700",
  },
]

const initialMaterials: MaterialItem[] = [
  { id: "m1", courseCode: "CS-301-001", title: "สไลด์บรรยายบทที่ 5: Relational Normalization & BCNF", type: "pdf", sizeOrDuration: "4.2 MB", uploadDate: "02 ก.ย. 2568" },
  { id: "m2", courseCode: "CS-301-001", title: "วิดีโอบันทึกย้อนหลัง: Query Optimization & Indexing Strategies", type: "video", sizeOrDuration: "1 ชม. 45 นาที", uploadDate: "03 ก.ย. 2568" },
  { id: "m3", courseCode: "CS-302-001", title: "สไลด์บรรยายบทที่ 4: TDD & End-to-End Testing with Vitest", type: "slide", sizeOrDuration: "8.5 MB", uploadDate: "04 ก.ย. 2568" },
  { id: "m4", courseCode: "CS-303-001", title: "Lab Manual: Configuring TLS 1.3 & PKI Cryptography", type: "pdf", sizeOrDuration: "2.8 MB", uploadDate: "05 ก.ย. 2568" },
]

const initialAssignments: AssignmentItem[] = [
  { id: "a1", courseCode: "CS-301-001", title: "การบ้านที่ 3: ออกแบบ Schema ฐานข้อมูลและคำนวณ 3NF / BCNF", dueDate: "10 ก.ย. 2568 (23:59 น.)", dueCountdown: "อีก 4 วัน", maxScore: 20, status: "PENDING" },
  { id: "a2", courseCode: "CS-302-001", title: "Mini Project 1: เขียน Unit Test และ Integration Test ครบ 80% Coverage", dueDate: "05 ก.ย. 2568", dueCountdown: "ส่งแล้ว", maxScore: 30, submittedScore: 28.5, status: "GRADED", feedback: "โครงสร้าง Test ครอบคลุม Edge Cases ดีมาก รหัสผ่านและ PII ถูกเข้ารหัสถูกต้อง" },
  { id: "a3", courseCode: "CS-303-001", title: "แบบฝึกหัด: วิเคราะห์ Packet Capture และตรวจจับ Brute Force Attack", dueDate: "08 ก.ย. 2568", dueCountdown: "รอตรวจ", maxScore: 15, status: "SUBMITTED" },
]

const initialQuizzes: QuizItem[] = [
  { id: "q1", courseCode: "CS-301-001", title: "ควิซท้ายบท: SQL Execution Plan & Indexing Mechanics", durationMinutes: 20, totalQuestions: 15, maxScore: 15, status: "OPEN" },
  { id: "q2", courseCode: "CS-302-001", title: "สอบเก็บคะแนนกลางภาค: CI/CD Pipelines & Clean Code Architecture", durationMinutes: 45, totalQuestions: 30, maxScore: 30, status: "COMPLETED", score: 27 },
]

export default function LmsPortalPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "materials" | "assignments" | "quizzes">("courses")
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL")
  const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments)
  const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentItem | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string>("")
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null)
  
  // Interactive Quiz Modal
  const [takingQuiz, setTakingQuiz] = useState<QuizItem | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({})
  const [quizResultModal, setQuizResultModal] = useState<{ score: number; maxScore: number } | null>(null)

  const handleOpenSubmitModal = (assignment: AssignmentItem) => {
    setSubmittingAssignment(assignment)
    setUploadFileName("")
  }

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!submittingAssignment || !uploadFileName) return
    setAssignments(prev => prev.map(item => item.id === submittingAssignment.id ? { ...item, status: 'SUBMITTED', dueCountdown: 'ส่งแล้ว' } : item))
    setUploadSuccessAlert(`ส่งงาน "${submittingAssignment.title}" เรียบร้อยแล้ว (ไฟล์: ${uploadFileName}) ตรวจสอบ SHA-256 Checksum สำเร็จ`)
    setSubmittingAssignment(null)
    setTimeout(() => setUploadSuccessAlert(null), 5000)
  }

  const handleStartQuiz = (quiz: QuizItem) => {
    setTakingQuiz(quiz)
    setQuizAnswers({})
  }

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    if (!takingQuiz) return
    // Simulated grading
    const calculatedScore = Math.floor(takingQuiz.maxScore * 0.9)
    setQuizResultModal({ score: calculatedScore, maxScore: takingQuiz.maxScore })
    setTakingQuiz(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>ศูนย์บริการกลาง</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                LMS
              </div>
              <h1 className="text-base font-bold text-slate-900">
                ระบบห้องเรียนออนไลน์ & บทเรียนดิจิทัล
              </h1>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Post-MVP Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">นายวีรภัทร ชาญวณิชย์</span>
              <span className="text-[11px] text-slate-500">รหัสนักศึกษา 66010042 • ปี 3 คอมพิวเตอร์</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-300">
              VC
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-md mb-3">
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Learning Management System — College Digital Classroom</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              ยินดีต้อนรับสู่ศูนย์การเรียนรู้ออนไลน์ประจำภาคเรียน 1/2568
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              เข้าถึงห้องเรียนเสมือนจริง, สตรีมมิ่งวิดีโอบรรยายย้อนหลัง, ส่งงานและประเมินผลการเรียนรู้แบบ Real-time เชื่อมโยงกับฐานข้อมูลทะเบียนกลาง SIS
            </p>
          </div>
        </div>

        {uploadSuccessAlert && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span>{uploadSuccessAlert}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "courses"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">meeting_room</span>
            <span>ห้องเรียนของฉัน ({initialCourses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "materials"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            <span>คลังเอกสาร & สื่อการสอน ({initialMaterials.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "assignments"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">assignment</span>
            <span>กล่องส่งการบ้าน ({assignments.filter(a => a.status === 'PENDING').length} รายการรอดำเนินการ)</span>
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "quizzes"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">quiz</span>
            <span>แบบทดสอบออนไลน์ ({initialQuizzes.length})</span>
          </button>
        </div>

        {/* Tab Content 1: Active Courses */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className={`h-24 bg-gradient-to-r ${course.accentColor} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/25 backdrop-blur-sm">
                        {course.code}
                      </span>
                      <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                        {course.completedModules}/{course.totalModules} บทเรียน
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                      {course.nameTh}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">{course.nameEn}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                      <span className="material-symbols-outlined text-base text-slate-400">person</span>
                      <span>{course.instructor}</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                        <span>ความก้าวหน้าการเรียนรู้</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 mb-4">
                      <span className="font-semibold text-slate-800 block mb-1">คาบเรียนเสมือนจริงถัดไป:</span>
                      <div className="flex items-center gap-1 text-indigo-700 font-medium">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{course.nextLiveSession}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={course.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200"
                  >
                    <span className="material-symbols-outlined text-base">video_call</span>
                    <span>เข้าห้องเรียนออนไลน์เสมือนจริง</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 2: Course Materials */}
        {activeTab === "materials" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">เอกสารประกอบการสอน & สตรีมมิ่งวิดีโอ</h3>
                <p className="text-xs text-slate-500">ดาวน์โหลดเอกสารประกอบการบรรยายและชมวิดีโอย้อนหลัง</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">กรองตามรายวิชา:</span>
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">ทุกรายวิชา</option>
                  <option value="CS-301-001">CS-301 ระบบฐานข้อมูล</option>
                  <option value="CS-302-001">CS-302 วิศวกรรมซอฟต์แวร์</option>
                  <option value="CS-303-001">CS-303 ไซเบอร์ซีเคียวริตี้</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {initialMaterials
                .filter(m => selectedCourseFilter === "ALL" || m.courseCode === selectedCourseFilter)
                .map((material) => (
                  <div key={material.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        material.type === 'video' ? 'bg-rose-100 text-rose-600' :
                        material.type === 'slide' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {material.type === 'video' ? 'play_circle' : material.type === 'slide' ? 'slideshow' : 'description'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {material.courseCode}
                          </span>
                          <span className="text-xs text-slate-400">• {material.uploadDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{material.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">ขนาด/ความยาว: {material.sizeOrDuration}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`เปิดดูสื่อการสอน: ${material.title}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors shrink-0 self-start sm:self-center"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      <span>เปิดอ่าน / ดาวน์โหลด</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Assignments */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    assignment.status === 'GRADED' ? 'bg-emerald-100 text-emerald-700' :
                    assignment.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {assignment.status === 'GRADED' ? 'task_alt' : assignment.status === 'SUBMITTED' ? 'mark_chat_read' : 'pending_actions'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {assignment.courseCode}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        assignment.status === 'GRADED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        assignment.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {assignment.status === 'GRADED' ? 'ตรวจคะแนนแล้ว' : assignment.status === 'SUBMITTED' ? 'ส่งไฟล์แล้ว (รอตรวจ)' : 'ยังไม่ได้ส่ง'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{assignment.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">กำหนดส่ง: {assignment.dueDate} ({assignment.dueCountdown})</p>
                    
                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                        <span className="font-bold block mb-0.5">ข้อเสนอแนะจากผู้สอน:</span>
                        <p>{assignment.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right mb-3">
                    <span className="text-xs text-slate-400 block">คะแนนที่ได้</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {assignment.submittedScore !== undefined ? `${assignment.submittedScore} / ${assignment.maxScore}` : `- / ${assignment.maxScore}`}
                    </span>
                  </div>
                  {assignment.status === 'PENDING' && (
                    <button
                      onClick={() => handleOpenSubmitModal(assignment)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">upload_file</span>
                      <span>ส่งงาน / แนบไฟล์</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 4: Quizzes */}
        {activeTab === "quizzes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {quiz.courseCode}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      quiz.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {quiz.status === 'OPEN' ? 'เปิดให้ทำแบบทดสอบ' : 'ทำแบบทดสอบแล้ว'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{quiz.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mb-5">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">เวลาในการทำ</span>
                      <span className="font-bold text-slate-800">{quiz.durationMinutes} นาที</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">จำนวนข้อสอบ</span>
                      <span className="font-bold text-slate-800">{quiz.totalQuestions} ข้อ ({quiz.maxScore} คะแนน)</span>
                    </div>
                  </div>
                </div>

                <div>
                  {quiz.status === 'OPEN' ? (
                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                      <span>เริ่มทำแบบทดสอบออนไลน์</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-700">
                      คะแนนที่บันทึก: {quiz.score} / {quiz.maxScore} คะแนน (ผ่านเกณฑ์)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Assignment Submission */}
        {submittingAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">กล่องส่งผลงาน / การบ้านดิจิทัล</h3>
                <button
                  onClick={() => setSubmittingAssignment(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="mb-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                <span className="font-bold block mb-0.5">{submittingAssignment.courseCode}: {submittingAssignment.title}</span>
                <span className="text-slate-500">กำหนดส่ง: {submittingAssignment.dueDate}</span>
              </div>

              <form onSubmit={handleConfirmSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    เลือกไฟล์งาน (.pdf, .zip, .docx ขนาดสูงสุด 50 MB)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50">
                    <span className="material-symbols-outlined text-3xl text-indigo-600 mb-2">cloud_upload</span>
                    <input
                      type="file"
                      id="assignment-file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setUploadFileName(file.name)
                      }}
                    />
                    <label
                      htmlFor="assignment-file"
                      className="cursor-pointer block text-xs font-bold text-indigo-700 hover:text-indigo-800"
                    >
                      {uploadFileName ? uploadFileName : "คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่"}
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">ระบบจะตรวจสอบ SHA-256 Checksum โดยอัตโนมัติ</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ข้อความหรือหมายเหตุถึงอาจารย์ผู้สอน (ถ้ามี)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ระบุลิงก์ GitHub Repository หรือคำอธิบายเพิ่มเติม..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubmittingAssignment(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFileName}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    ยืนยันการส่งงานดิจิทัล
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Taking Quiz */}
        {takingQuiz && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {takingQuiz.courseCode}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{takingQuiz.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">เวลาที่เหลือ</span>
                  <span className="text-base font-extrabold text-rose-600">19:42 นาที</span>
                </div>
              </div>

              <form onSubmit={handleSubmitQuiz} className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 block mb-1">คำถามข้อที่ 1 (5 คะแนน)</span>
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    ข้อใดคือเงื่อนไขสำคัญที่สุดในการแปลงความสัมพันธ์ของตารางฐานข้อมูลให้เข้าสู่มาตรฐาน Third Normal Form (3NF)?
                  </p>
                  <div className="space-y-2 text-xs">
                    {[
                      "A. ตารางต้องอยู่ในรูป 2NF และไม่มี Transitive Functional Dependency",
                      "B. ตารางต้องมี Foreign Key ชี้ไปยัง Primary Key ทุกตาราง",
                      "C. ทุกคอลัมน์ต้องอนุญาตให้มีค่า NULL ได้",
                      "D. ต้องทำการลบ Composite Key ทั้งหมดออกจากสารบรรณ",
                    ].map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/50 cursor-pointer">
                        <input
                          type="radio"
                          name="q1"
                          checked={quizAnswers[1] === opt}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, 1: opt }))}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-indigo-600 block mb-1">คำถามข้อที่ 2 (5 คะแนน)</span>
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    การสร้าง B-Tree Index บนคอลัมน์ที่มี Cardinality ต่ำ (เช่น เพศ ชาย/หญิง) ส่งผลต่อ Query Performance อย่างไร?
                  </p>
                  <div className="space-y-2 text-xs">
                    {[
                      "A. ทำให้ Performance เพิ่มขึ้น 100 เท่าเสมอ",
                      "B. ไม่ช่วยเพิ่มความเร็วและอาจทำให้ Database Optimizer เลือก Full Table Scan แทน",
                      "C. ป้องกัน SQL Injection อัตโนมัติ",
                      "D. ทำให้ Database ล็อกหน่วยความจำทั้งหมด",
                    ].map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50/50 cursor-pointer">
                        <input
                          type="radio"
                          name="q2"
                          checked={quizAnswers[2] === opt}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, 2: opt }))}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setTakingQuiz(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ออกจากการสอบ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    ส่งคำตอบและตรวจข้อสอบทันที
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Quiz Result */}
        {quizResultModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">military_tech</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">ผลการทดสอบออนไลน์</h3>
              <p className="text-xs text-slate-500 mb-4">ระบบบันทึกคะแนนเข้าสู่ผลสัมฤทธิ์ทางการศึกษาเรียบร้อย</p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <span className="text-xs text-slate-400 block mb-1">คะแนนที่ได้</span>
                <span className="text-3xl font-extrabold text-emerald-600">
                  {quizResultModal.score} <span className="text-base text-slate-400 font-normal">/ {quizResultModal.maxScore}</span>
                </span>
                <span className="block text-xs font-bold text-emerald-700 mt-1">ระดับดีเยี่ยม (90%)</span>
              </div>

              <button
                onClick={() => setQuizResultModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                กลับสู่หน้าหลัก LMS
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
