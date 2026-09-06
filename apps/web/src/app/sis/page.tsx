'use client'

import React, { useState } from "react"
import Link from "next/link"
import { formatThaiDate } from "@repo/utils"
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Award,
  FileText,
  Check,
  Plus,
  Trash2
} from "lucide-react"

interface Course {
  id: string
  code: string
  nameTh: string
  credit: number
  section: string
  instructor: string
  room: string
  enrolled: number
  capacity: number
}

const mockCourses: Course[] = [
  { id: "1", code: "CPE-101", nameTh: "การโปรแกรมคอมพิวเตอร์ขั้นต้น (Intro to Computer Programming)", credit: 3, section: "01", instructor: "ดร.สมชาย สมหวัง", room: "Lab-401", enrolled: 28, capacity: 40 },
  { id: "2", code: "CPE-201", nameTh: "โครงสร้างข้อมูลและขั้นตอนวิธี (Data Structures & Algorithms)", credit: 3, section: "01", instructor: "ผศ.ดร.วิภาดา ชัยชนะ", room: "Com-302", enrolled: 35, capacity: 40 },
  { id: "3", code: "GEN-102", nameTh: "ภาษาอังกฤษเพื่อการสื่อสารทางวิชาการ (English for Academic Communication)", credit: 3, section: "02", instructor: "อ.จอห์น สมิธ", room: "LC-201", enrolled: 39, capacity: 40 },
  { id: "4", code: "MAT-101", nameTh: "แคลคูลัสสำหรับวิศวกรรม (Calculus for Engineers)", credit: 3, section: "01", instructor: "รศ.ดร.นพพร มั่นคง", room: "Lec-101", enrolled: 40, capacity: 40 },
]

export default function SisPage() {
  const [enrolledIds, setEnrolledIds] = useState<string[]>(["1"])
  const [activeTab, setActiveTab] = useState<"courses" | "my-courses" | "transcript">("courses")

  const toggleEnroll = (id: string) => {
    if (enrolledIds.includes(id)) {
      setEnrolledIds(enrolledIds.filter((item) => item !== id))
    } else {
      setEnrolledIds([...enrolledIds, id])
    }
  }

  const totalCredits = enrolledIds
    .map((id) => mockCourses.find((c) => c.id === id)?.credit || 0)
    .reduce((a, b) => a + b, 0)

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#64748b",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>

      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
            <span style={{ background: "#eff6ff", color: "#2563eb", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <BookOpen size={20} />
            </span>
            <h1 style={{ color: "#1e3a8a", margin: 0, fontSize: "1.5rem" }}>
              ระบบบริการการศึกษา (SIS Online Portal)
            </h1>
          </div>
          <p style={{ color: "#475569", margin: 0, fontSize: "0.9rem" }}>
            ภาคเรียนที่ 1/2568 | วันที่: {formatThaiDate()}
          </p>
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            padding: "6px 14px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={15} />
          <span>เปิดระบบลงทะเบียนปกติ</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("courses")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.75rem 1.25rem",
            border: "none",
            borderBottom: activeTab === "courses" ? "3px solid #2563eb" : "3px solid transparent",
            background: "none",
            fontWeight: activeTab === "courses" ? 700 : 500,
            cursor: "pointer",
            color: activeTab === "courses" ? "#2563eb" : "#64748b",
            fontSize: "0.95rem",
          }}
        >
          <BookOpen size={16} />
          <span>รายวิชาเปิดสอน (Course Catalog)</span>
        </button>

        <button
          onClick={() => setActiveTab("my-courses")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.75rem 1.25rem",
            border: "none",
            borderBottom: activeTab === "my-courses" ? "3px solid #2563eb" : "3px solid transparent",
            background: "none",
            fontWeight: activeTab === "my-courses" ? 700 : 500,
            cursor: "pointer",
            color: activeTab === "my-courses" ? "#2563eb" : "#64748b",
            fontSize: "0.95rem",
          }}
        >
          <Check size={16} />
          <span>วิชาที่ลงทะเบียนแล้ว ({enrolledIds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("transcript")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.75rem 1.25rem",
            border: "none",
            borderBottom: activeTab === "transcript" ? "3px solid #2563eb" : "3px solid transparent",
            background: "none",
            fontWeight: activeTab === "transcript" ? 700 : 500,
            cursor: "pointer",
            color: activeTab === "transcript" ? "#2563eb" : "#64748b",
            fontSize: "0.95rem",
          }}
        >
          <GraduationCap size={16} />
          <span>ผลการเรียน (Transcript)</span>
        </button>
      </div>

      {/* Tab 1: Courses Catalog */}
      {activeTab === "courses" && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.15rem", color: "#0f172a", margin: 0 }}>รายวิชาที่เปิดรับลงทะเบียน</h2>
            <span style={{ color: "#2563eb", fontWeight: 600, fontSize: "0.9rem", background: "#eff6ff", padding: "4px 10px", borderRadius: 6 }}>
              หน่วยกิตที่เลือก: {totalCredits} / 22 สูงสุด
            </span>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {mockCourses.map((course) => {
              const isEnrolled = enrolledIds.includes(course.id)
              const isFull = course.enrolled >= course.capacity

              return (
                <div
                  key={course.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isEnrolled ? "#f0fdf4" : "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.35rem" }}>
                      <span style={{ background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: 4, fontSize: "0.85rem", fontWeight: "bold", fontFamily: "monospace" }}>
                        {course.code}
                      </span>
                      <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: 4, fontSize: "0.8rem" }}>
                        กลุ่ม {course.section}
                      </span>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a" }}>{course.nameTh}</h3>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", color: "#64748b", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Users size={13} />
                        อาจารย์ผู้สอน: {course.instructor}
                      </span>
                      <span>•</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={13} />
                        ห้องเรียน: {course.room}
                      </span>
                      <span>•</span>
                      <span>{course.credit} หน่วยกิต</span>
                    </div>

                    <div style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: isFull ? "#dc2626" : "#16a34a", fontWeight: 500 }}>
                      ที่นั่ง: {course.enrolled} / {course.capacity} {isFull ? "(เต็มแล้ว)" : ""}
                    </div>
                  </div>

                  <button
                    disabled={!isEnrolled && isFull}
                    onClick={() => toggleEnroll(course.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: isEnrolled ? "#fee2e2" : isFull ? "#f1f5f9" : "#2563eb",
                      color: isEnrolled ? "#b91c1c" : isFull ? "#94a3b8" : "#ffffff",
                      border: isEnrolled ? "1px solid #fecaca" : "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: !isEnrolled && isFull ? "not-allowed" : "pointer",
                    }}
                  >
                    {isEnrolled ? (
                      <>
                        <Trash2 size={14} />
                        <span>ถอนรายวิชา</span>
                      </>
                    ) : isFull ? (
                      <span>ที่นั่งเต็ม</span>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>ลงทะเบียน</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Tab 2: My Courses */}
      {activeTab === "my-courses" && (
        <section>
          <h2 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "1rem" }}>รายการวิชาที่ลงทะเบียนไว้</h2>
          {enrolledIds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <p style={{ color: "#64748b" }}>ยังไม่มีวิชาที่ลงทะเบียนในภาคเรียนนี้</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {mockCourses
                .filter((c) => enrolledIds.includes(c.id))
                .map((course) => (
                  <div
                    key={course.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      padding: "1.25rem 1.5rem",
                      borderRadius: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#0f172a", fontSize: "1.05rem" }}>
                        {course.code} - {course.nameTh}
                      </strong>
                      <p style={{ margin: "0.35rem 0 0 0", color: "#64748b", fontSize: "0.875rem" }}>
                        กลุ่ม {course.section} ({course.credit} หน่วยกิต) | ห้อง {course.room} | {course.instructor}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleEnroll(course.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#fff1f2",
                        color: "#be123c",
                        border: "1px solid #fecdd3",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} />
                      ถอนวิชา
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Transcript */}
      {activeTab === "transcript" && (
        <section>
          <h2 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "1rem" }}>
            ผลการเรียนสะสม (Online Unofficial Transcript)
          </h2>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div>
                <span style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Award size={14} color="#16a34a" />
                  เกรดเฉลี่ยสะสม (Cumulative GPA)
                </span>
                <h1 style={{ margin: "0.35rem 0 0 0", color: "#16a34a", fontSize: "2.5rem", fontWeight: 700 }}>
                  3.72
                </h1>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <BookOpen size={14} color="#1e3a8a" />
                  หน่วยกิตสะสม (Total Credits)
                </span>
                <h1 style={{ margin: "0.35rem 0 0 0", color: "#1e3a8a", fontSize: "2.5rem", fontWeight: 700 }}>
                  36
                </h1>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} color="#2563eb" />
                  สถานะทางวิชาการ
                </span>
                <h1 style={{ margin: "0.35rem 0 0 0", color: "#2563eb", fontSize: "1.75rem", fontWeight: 700 }}>
                  สภาพปกติ (Normal)
                </h1>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
