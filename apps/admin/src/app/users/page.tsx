'use client'

import React, { useState } from "react"
import Link from "next/link"
import { formatThaiDate } from "@repo/utils"
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Mail,
  UserCheck,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Tag
} from "lucide-react"

interface UserItem {
  id: string
  username: string
  nameTh: string
  email: string
  userType: string
  roles: string[]
  isActive: boolean
}

const mockUsers: UserItem[] = [
  { id: "1", username: "admin", nameTh: "ผู้ดูแล ระบบสารสนเทศ", email: "admin@college.ac.th", userType: "admin", roles: ["it_admin"], isActive: true },
  { id: "2", username: "dean.cs", nameTh: "ศ.ดร.ประเสริฐ สุขใจ", email: "dean.cs@college.ac.th", userType: "instructor", roles: ["executive", "instructor"], isActive: true },
  { id: "3", username: "reg.officer", nameTh: "นางสมศรี มีสุข", email: "reg01@college.ac.th", userType: "staff", roles: ["registrar"], isActive: true },
  { id: "4", username: "doc.officer", nameTh: "นายวินัย มั่นคง", email: "doc01@college.ac.th", userType: "staff", roles: ["document_officer"], isActive: true },
  { id: "5", username: "dpo.officer", nameTh: "นายเอกชัย ปกป้อง", email: "dpo@college.ac.th", userType: "staff", roles: ["dpo"], isActive: true },
]

export default function UsersManagementPage() {
  const [userList, setUserList] = useState<UserItem[]>(mockUsers)
  const [search, setSearch] = useState("")

  const filtered = userList.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.nameTh.includes(search) ||
      u.email.includes(search)
  )

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
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
          <span>กลับสู่ Executive Dashboard</span>
        </Link>
      </div>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
            <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <Users size={20} />
            </span>
            <h1 style={{ color: "#0f172a", margin: 0, fontSize: "1.5rem" }}>
              ระบบจัดการผู้ใช้งานและสิทธิ์ (User & RBAC Console)
            </h1>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            จัดการบัญชีผู้ใช้ มอบหมายบทบาท และควบคุมการเข้าถึงตามหลัก PDPA | {formatThaiDate()}
          </p>
        </div>

        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#0f766e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => alert("ระบบเปิดแบบฟอร์มเพิ่มผู้ใช้ใหม่")}
        >
          <UserPlus size={16} />
          <span>เพิ่มผู้ใช้ใหม่</span>
        </button>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: "1.5rem", position: "relative", maxWidth: 420 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="ค้นหาตามชื่อ, ชื่อผู้ใช้, หรืออีเมล..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 1rem 0.65rem 2.4rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
      </div>

      {/* Users Table */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <tr>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>ชื่อผู้ใช้</th>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>อีเมล</th>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>ประเภท</th>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>บทบาท (Roles)</th>
              <th style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.85rem", fontWeight: 600 }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "1rem", fontWeight: "bold", color: "#0f172a", fontFamily: "monospace" }}>
                  {user.username}
                </td>
                <td style={{ padding: "1rem", color: "#334155", fontWeight: 500 }}>{user.nameTh}</td>
                <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.9rem" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={14} color="#94a3b8" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "#334155" }}>
                  <span style={{ textTransform: "capitalize", fontSize: "0.85rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
                    {user.userType}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {user.roles.map((r) => (
                      <span
                        key={r}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          background: "#e0e7ff",
                          color: "#3730a3",
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        <Shield size={10} />
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: user.isActive ? "#dcfce7" : "#fee2e2",
                      color: user.isActive ? "#15803d" : "#b91c1c",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 12,
                    }}
                  >
                    {user.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {user.isActive ? "เปิดใช้งาน" : "ระงับ"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
