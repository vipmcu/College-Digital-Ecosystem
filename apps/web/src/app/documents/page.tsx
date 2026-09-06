'use client'

import React, { useState } from "react"
import Link from "next/link"
import { formatThaiDate } from "@repo/utils"
import {
  FileText,
  FilePlus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  X,
  UploadCloud,
  FileCheck
} from "lucide-react"

interface DocumentItem {
  id: string
  docNumber: string
  subject: string
  type: string
  createdAt: string
  status: "draft" | "pending_approval" | "approved" | "rejected"
  currentApprover: string
}

const mockDocuments: DocumentItem[] = [
  { id: "1", docNumber: "DOC-2568-10294", subject: "คำร้องขอลาพักการศึกษาเพื่อศึกษาดูงานต่างประเทศ", type: "คำร้องขอลาพักการศึกษา", createdAt: "2026-09-01", status: "pending_approval", currentApprover: "คณบดีคณะวิทยาการคอมพิวเตอร์" },
  { id: "2", docNumber: "DOC-2568-08472", subject: "ขอหนังสือรับรองสถานภาพนักศึกษาเพื่อประกอบการขอทุนวิจัย", type: "หนังสือรับรองสถานภาพนักศึกษา", createdAt: "2026-08-15", status: "approved", currentApprover: "อนุมัติเรียบร้อย" },
  { id: "3", docNumber: "DOC-2568-05118", subject: "คำร้องขอเปลี่ยนกลุ่มเรียนวิชา CPE-201", type: "คำร้องทั่วไป", createdAt: "2026-08-10", status: "approved", currentApprover: "อนุมัติเรียบร้อย" },
]

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(mockDocuments)
  const [showModal, setShowModal] = useState(false)
  const [subject, setSubject] = useState("")
  const [docType, setDocType] = useState("คำร้องขอลาพักการศึกษา")
  const [body, setBody] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject) return

    const newDoc: DocumentItem = {
      id: String(Date.now()),
      docNumber: `DOC-2568-${Math.floor(10000 + Math.random() * 90000)}`,
      subject,
      type: docType,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending_approval",
      currentApprover: "หัวหน้างาน/อาจารย์ที่ปรึกษา",
    }

    setDocs([newDoc, ...docs])
    setShowModal(false)
    setSubject("")
    setBody("")
  }

  const getStatusBadge = (status: DocumentItem["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#dcfce7",
              color: "#15803d",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} />
            อนุมัติแล้ว
          </span>
        )
      case "pending_approval":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#fef9c3",
              color: "#a16207",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <Clock size={13} />
            กำลังรอดำเนินการ
          </span>
        )
      case "rejected":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <XCircle size={13} />
            ปฏิเสธ
          </span>
        )
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "#f3f4f6",
              color: "#4b5563",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "0.85rem",
            }}
          >
            ร่างเอกสาร
          </span>
        )
    }
  }

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
            <span style={{ background: "#f0fdfa", color: "#0f766e", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <FileText size={20} />
            </span>
            <h1 style={{ color: "#0f766e", margin: 0, fontSize: "1.5rem" }}>
              ระบบสารบรรณและคำร้องอิเล็กทรอนิกส์ (e-Document)
            </h1>
          </div>
          <p style={{ color: "#4b5563", margin: 0, fontSize: "0.9rem" }}>
            ติดตามสถานะคำร้องและหนังสือราชการออนไลน์ | {formatThaiDate()}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
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
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <FilePlus size={16} />
          <span>+ ยื่นคำร้องใหม่</span>
        </button>
      </header>

      {/* Document List */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.35rem" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#0f766e",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    background: "#f0fdfa",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {doc.docNumber}
                </span>
                <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "0.8rem", padding: "2px 8px", borderRadius: 4 }}>
                  {doc.type}
                </span>
              </div>
              <h3 style={{ margin: "0.4rem 0", color: "#0f172a", fontSize: "1.05rem" }}>{doc.subject}</h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span>ผู้อนุมัติขั้นตอนปัจจุบัน: <strong style={{ color: "#334155" }}>{doc.currentApprover}</strong></span>
                <span>•</span>
                <span>ยื่นเมื่อ: {doc.createdAt}</span>
              </p>
            </div>
            <div>{getStatusBadge(doc.status)}</div>
          </div>
        ))}
      </div>

      {/* Modal for new document */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              width: "100%",
              maxWidth: 550,
              padding: "2rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              margin: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#f0fdfa", color: "#0f766e", padding: "6px", borderRadius: "8px", display: "flex" }}>
                  <FilePlus size={18} />
                </span>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>ยื่นคำร้องอิเล็กทรอนิกส์</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                  ประเภทเอกสาร / คำร้อง
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  <option>คำร้องขอลาพักการศึกษา</option>
                  <option>หนังสือรับรองสถานภาพนักศึกษา</option>
                  <option>คำร้องทั่วไป</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                  หัวข้อ / เรื่อง
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ระบุหัวข้อคำร้อง..."
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
                  รายละเอียดเหตุผล
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="ระบุรายละเอียดเพิ่มเติมประกอบคำร้อง..."
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#0f766e",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Send size={15} />
                  <span>ส่งคำร้อง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
