'use client'

import React, { useState } from "react"
import Link from "next/link"

interface PendingItem {
  id: string
  docNumber: string
  subject: string
  type: string
  submittedBy: string
  dept: string
  submittedAt: string
  stepName: string
  stepIndex: number
  totalSteps: number
  slaRemainingHours: number
}

const initialApprovals: PendingItem[] = [
  {
    id: "appr-01",
    docNumber: "มอ 003.1/10294",
    subject: "คำร้องขอลาพักการศึกษาเพื่อเข้าร่วมการแข่งขันระดับนานาชาติ (นายธนภัทร สิริวัฒนกุล)",
    type: "คำร้องออนไลน์ (e-Petition)",
    submittedBy: "นายธนภัทร สิริวัฒนกุล (รหัส: 653040128-9)",
    dept: "สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์",
    submittedAt: "เมื่อวานนี้ 14:20 น.",
    stepName: "คณบดีคณะวิทยาการสารสนเทศและการคำนวณ",
    stepIndex: 2,
    totalSteps: 3,
    slaRemainingHours: 2.8,
  },
  {
    id: "appr-02",
    docNumber: "มอ 003.2/ว.0142",
    subject: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการปัญญาประดิษฐ์และคลาวด์สำหรับนักศึกษาชั้นปีที่ 3",
    type: "บันทึกข้อความภายใน (Memo)",
    submittedBy: "รศ.ดร. นันทิกร วิเศษสุข (หัวหน้าสาขาวิชา)",
    dept: "สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์",
    submittedAt: "วันนี้ 08:45 น.",
    stepName: "รองคณบดีฝ่ายวิชาการและวิจัย",
    stepIndex: 2,
    totalSteps: 3,
    slaRemainingHours: 7.5,
  },
  {
    id: "appr-03",
    docNumber: "มอ 001/11842",
    subject: "ขออนุมัติจัดซื้ออุปกรณ์ห้องปฏิบัติการเครือข่ายความเร็วสูง High-Performance Computing",
    type: "บันทึกข้อความภายใน (Memo)",
    submittedBy: "ผศ.ดร. ภาณุพงศ์ วงศ์สวรรค์",
    dept: "สำนักบริการเทคโนโลยีสารสนเทศ",
    submittedAt: "3 ก.ย. 2568",
    stepName: "ผู้อำนวยการสำนักบริการเทคโนโลยี",
    stepIndex: 1,
    totalSteps: 3,
    slaRemainingHours: 12.0,
  },
]

export default function ApprovalsQueuePage() {
  const [items, setItems] = useState<PendingItem[]>(initialApprovals)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const handleAction = (id: string, action: "approve" | "reject") => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    setItems(items.filter((i) => i.id !== id))
    const actionText = action === "approve" ? "ลงนามอนุมัติดิจิทัล (Digital Signature Signed)" : "ส่งกลับแก้ไข/ปฏิเสธคำร้อง"
    setToastMsg(`${actionText} สำหรับเอกสาร ${item.docNumber} สำเร็จ`)
    setTimeout(() => setToastMsg(null), 4000)
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-50 bg-surface-card/95 backdrop-blur-md shadow-xs border-b border-border-subtle">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-1.5 text-secondary hover:text-navy-deep font-label-md text-label-md transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>กลับหน้าแดชบอร์ด</span>
            </Link>
            <span className="text-outline-variant">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-primary text-surface-card flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">fact_check</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Workflow Approval Queue
                </span>
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant ml-2">
                  คิวพิจารณาอนุมัติคำร้องและลงนาม (M03-F02)
                </span>
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-amber-subtle text-amber-primary rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-primary animate-ping"></span>
            รอพิจารณา {items.length} รายการ
          </span>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="w-full bg-surface-canvas flex-1 pb-space-3xl">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-navy-deep text-surface-card px-space-md py-space-sm rounded-xl shadow-xl border border-navy-surface flex items-center gap-space-sm animate-bounce">
            <span className="material-symbols-outlined text-status-success">check_circle</span>
            <span className="font-body-sm text-body-sm">{toastMsg}</span>
          </div>
        )}

        {/* Sub-bar */}
        <section className="w-full bg-navy-deep text-on-primary py-space-lg shadow-xs">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
              <div className="space-y-space-2xs">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container text-primary-fixed-dim uppercase tracking-wider">
                    โมดูล M03 • Workflow Approvals
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm bg-status-success/20 text-status-success">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    CA Token Ready
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-surface-card tracking-tight font-bold">
                  แฟ้มเสนอเซ็นและคิวพิจารณาอนุมัติคำร้องดิจิทัล
                </h1>
                <p className="text-xs text-surface-container-high">
                  รายการเอกสารราชการและคำร้องออนไลน์ที่รอการลงนามดิจิทัล (Digital Signature) จากท่านตามลำดับชั้นการบังคับบัญชา
                </p>
              </div>

              <div className="bg-navy-surface/80 p-space-sm rounded-xl border border-navy-surface text-xs space-y-1">
                <div className="font-bold text-amber-subtle flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  เกณฑ์ SLA การอนุมัติ
                </div>
                <div className="text-slate-300">กำหนดลงนามให้แล้วเสร็จภายใน 24 ชม.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Approvals List Container */}
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-md">
          {items.length === 0 ? (
            <div className="bg-surface-card rounded-2xl p-space-3xl text-center space-y-space-sm border border-border-subtle shadow-xs">
              <span className="material-symbols-outlined text-5xl text-status-success">task_alt</span>
              <h3 className="font-headline-md text-headline-md font-bold text-navy-deep">
                ไม่มีเอกสารรอพิจารณาในขณะนี้
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                ท่านได้ลงนามและพิจารณาคำร้องทั้งหมดเรียบร้อยแล้ว ระบบจะส่งการแจ้งเตือนเมื่อมีเอกสารใหม่เข้ามา
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle hover:border-secondary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-space-md"
              >
                <div className="space-y-space-xs flex-1">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                      {item.docNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-primary/15 text-amber-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-primary animate-ping"></span>
                      รอการลงนามพิจารณา
                    </span>
                    <span className="text-xs text-status-warning font-semibold">
                      (เหลือเวลา {item.slaRemainingHours} ชม.)
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {item.subject}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-xs text-on-surface-variant">
                    <span>ผู้ยื่นเสนอ: <strong className="text-navy-deep">{item.submittedBy}</strong></span>
                    <span>•</span>
                    <span>สังกัด: {item.dept}</span>
                    <span>•</span>
                    <span>ยื่นเมื่อ: {item.submittedAt}</span>
                  </div>

                  <div className="pt-space-2xs text-xs font-semibold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">flowsheet</span>
                    <span>ตำแหน่งพิจารณา: {item.stepName} (ขั้นตอนที่ {item.stepIndex}/{item.totalSteps})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-space-sm shrink-0">
                  <button
                    onClick={() => handleAction(item.id, "reject")}
                    className="px-space-md py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-status-danger font-label-md text-label-md font-semibold border border-border-subtle transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">undo</span>
                    <span>ส่งกลับแก้ไข</span>
                  </button>

                  <button
                    onClick={() => handleAction(item.id, "approve")}
                    className="px-space-md py-2 rounded-lg bg-amber-primary hover:bg-status-warning text-surface-card font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">draw</span>
                    <span>ลงนามอนุมัติ (Sign)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-md border-t border-navy-surface mt-auto">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-primary-fixed-dim">
          <span>College Workflow Management • Module 03 Approvals Queue</span>
          <span>&copy; 2569 งานสารบรรณและระเบียบปฏิบัติ มหาวิทยาลัย</span>
        </div>
      </footer>
    </div>
  )
}
