'use client'

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@repo/ui"
import { formatThaiDate } from "@repo/utils"
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  Check,
  X,
  AlertCircle
} from "lucide-react"

interface PendingItem {
  id: string
  docNumber: string
  subject: string
  submittedBy: string
  submittedAt: string
  stepName: string
}

const mockPending: PendingItem[] = [
  {
    id: "1",
    docNumber: "DOC-2568-10294",
    subject: "คำร้องขอลาพักการศึกษาเพื่อศึกษาดูงานต่างประเทศ",
    submittedBy: "นายกิตติศักดิ์ แก้วมณี (รหัสนักศึกษา 6501002341)",
    submittedAt: "2026-09-01",
    stepName: "คณบดีคณะวิทยาการคอมพิวเตอร์",
  },
  {
    id: "2",
    docNumber: "DOC-2568-11842",
    subject: "ขออนุมัติจัดซื้ออุปกรณ์ห้องปฏิบัติการเครือข่ายความเร็วสูง",
    submittedBy: "ผศ.ดร.วิภาดา ชัยชนะ",
    submittedAt: "2026-09-03",
    stepName: "ผู้อำนวยการสำนักวิชาการ",
  },
]

export default function ApprovalsPage() {
  const [items, setItems] = useState<PendingItem[]>(mockPending)

  const handleAction = (id: string, action: "approve" | "reject") => {
    alert(`ดำเนินการ ${action === "approve" ? "ลงนามอนุมัติ" : "ปฏิเสธ"} เอกสารเรียบร้อยแล้ว`)
    setItems(items.filter((i) => i.id !== id))
  }

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
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
            <span style={{ background: "#fef3c7", color: "#b45309", padding: "6px", borderRadius: "8px", display: "flex" }}>
              <FileCheck size={20} />
            </span>
            <h1 style={{ color: "#0f172a", margin: 0, fontSize: "1.5rem" }}>
              แฟ้มพิจารณาอนุมัติเอกสาร (Executive Approval Queue)
            </h1>
          </div>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            รายการเอกสารและคำร้องที่รอดำเนินการลงนามดิจิทัล | {formatThaiDate()}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: items.length > 0 ? "#fef3c7" : "#dcfce7",
            color: items.length > 0 ? "#b45309" : "#15803d",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          <Clock size={14} />
          รอพิจารณา {items.length} รายการ
        </span>
      </header>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ color: "#16a34a", margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>
            ไม่มีเอกสารค้างพิจารณา
          </h3>
          <p style={{ color: "#64748b", margin: 0 }}>
            คุณได้ดำเนินการครบถ้วนทุกรายการในคิวอนุมัติแล้ว
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      color: "#0f766e",
                      fontWeight: "bold",
                      background: "#f0fdfa",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {item.docNumber}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#b45309",
                      fontWeight: 600,
                      background: "#fef3c7",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    ขั้นตอน: {item.stepName}
                  </span>
                </div>

                <h3 style={{ margin: "0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>
                  {item.subject}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b", fontSize: "0.875rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <User size={14} />
                    {item.submittedBy}
                  </span>
                  <span>•</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} />
                    ยื่นเมื่อ {item.submittedAt}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <button
                  onClick={() => handleAction(item.id, "reject")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#b91c1c",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  <X size={16} />
                  ปฏิเสธ
                </button>
                <button
                  onClick={() => handleAction(item.id, "approve")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#0f766e",
                    border: "none",
                    color: "#ffffff",
                    padding: "8px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <Check size={16} />
                  ลงนามอนุมัติ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
