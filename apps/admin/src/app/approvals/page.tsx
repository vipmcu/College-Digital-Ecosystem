'use client'

import React, { useState } from "react"
import Link from "next/link"
import { CampusSwitcher } from "../../components/campus-switcher"

interface ApprovalAttachment {
  name: string
  size: string
}

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
  content?: string
  attachments?: ApprovalAttachment[]
}

const initialApprovals: PendingItem[] = [
  {
    id: "appr-01",
    docNumber: "มอ 003.1/10294",
    subject: "คำร้องขอลาพักการศึกษาเพื่อเข้าร่วมการแข่งขันระดับนานาชาติ (นายธนภัทร สิริวัฒนกุล)",
    type: "คำร้องออนไลน์ (e-Petition)",
    submittedBy: "นายธนภัทร สิริวัฒนกุล (รหัส: 6601104567)",
    dept: "สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์",
    submittedAt: "เมื่อวานนี้ 14:20 น.",
    stepName: "คณบดีคณะวิทยาการสารสนเทศและการคำนวณ",
    stepIndex: 2,
    totalSteps: 3,
    slaRemainingHours: 2.8,
    content:
      "ข้าพเจ้านายธนภัทร สิริวัฒนกุล นักศึกษาชั้นปีที่ 3 สาขาวิทยาการคอมพิวเตอร์ มีความประสงค์ขอลาพักการศึกษาในภาคเรียนที่ 1/2569 เพื่อเป็นตัวแทนประเทศไทยเข้าร่วมการแข่งขันหุ่นยนต์ปัญญาประดิษฐ์ World Robocup ณ กรุงโตเกียว ประเทศญี่ปุ่น โดยได้รับการพิจารณารับรองจากอาจารย์ที่ปรึกษาแล้ว จึงเสนอเพื่อโปรดพิจารณาอนุมัติ",
    attachments: [
      { name: "หนังสือเชิญการแข่งขันระดับนานาชาติ.pdf", size: "3.2 MB" },
      { name: "ความเห็นและคำยินยอมของอาจารย์ที่ปรึกษา.pdf", size: "850 KB" },
    ],
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
    content:
      "ด้วย สาขาวิชาวิทยาการคอมพิวเตอร์ กำหนดจัดโครงการสัมมนาเชิงปฏิบัติการเทคโนโลยีปัญญาประดิษฐ์และคลาวด์คอมพิวติ้ง ระหว่างวันที่ 15-17 ตุลาคม 2569 ณ ห้องประชุมนวัตกรรมดิจิทัล เพื่อเสริมสร้างความรู้แก่นักศึกษาชั้นปีที่ 3 จำนวน 120 คน งบประมาณรวมทั้งสิ้น 45,000 บาท จึงใคร่ขออนุมัติจัดโครงการและเบิกจ่ายงบประมาณตามระเบียบ",
    attachments: [
      { name: "โครงการสัมมนา_AI_Cloud_2569.pdf", size: "2.4 MB" },
      { name: "ตารางกำหนดการและวิทยากรบรรยาย.pdf", size: "1.1 MB" },
    ],
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
    content:
      "สำนักบริการเทคโนโลยีสารสนเทศ มีความจำเป็นต้องจัดซื้อเครื่องแม่ข่ายและอุปกรณ์สวิตช์เครือข่ายความเร็วสูง 100Gbps สำหรับรองรับระบบ Big Data & HPC Cluster ของมหาวิทยาลัย เพื่อรองรับงานวิจัยและการเรียนการสอน โดยใช้งบประมาณจัดสรรประจำปี 2569",
    attachments: [
      { name: "TOR_ข้อกำหนดคุณลักษณะครุภัณฑ์_HPC.pdf", size: "4.5 MB" },
      { name: "ตารางเปรียบเทียบราคามาตรฐาน.pdf", size: "1.3 MB" },
    ],
  },
]

export default function ApprovalsQueuePage() {
  const [items, setItems] = useState<PendingItem[]>(initialApprovals)
  const [selectedItemForReview, setSelectedItemForReview] = useState<PendingItem | null>(null)
  const [reviewerNote, setReviewerNote] = useState("")
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const handleAction = (id: string, action: "approve" | "reject", note?: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    setItems(items.filter((i) => i.id !== id))
    setSelectedItemForReview(null)
    setReviewerNote("")
    const actionText =
      action === "approve"
        ? `ลงนามอนุมัติดิจิทัลสำเร็จ (Digital Signature Signed)`
        : `ส่งกลับแก้ไข/ตีกลับคำร้องเรียบร้อย`
    setToastMsg(`${actionText}: ${item.docNumber} ${note ? `(${note})` : ""}`)
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

          <div className="flex items-center gap-space-sm">
            <CampusSwitcher />
            <span className="px-2.5 py-1 bg-amber-subtle text-amber-primary rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-primary animate-ping"></span>
              รอพิจารณา {items.length} รายการ
            </span>
          </div>
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
                    onClick={() => {
                      setSelectedItemForReview(item)
                      setReviewerNote("")
                    }}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>ตรวจพิจารณา</span>
                  </button>

                  <button
                    onClick={() => handleAction(item.id, "reject")}
                    className="px-space-md py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-status-danger font-label-md text-label-md font-semibold border border-border-subtle transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">undo</span>
                    <span>ส่งกลับ</span>
                  </button>

                  <button
                    onClick={() => handleAction(item.id, "approve")}
                    className="px-space-md py-2 rounded-lg bg-amber-primary hover:bg-status-warning text-surface-card font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">draw</span>
                    <span>ลงนามอนุมัติ</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Review & e-Sign Modal */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card rounded-2xl max-w-2xl w-full shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-primary text-2xl">fact_check</span>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-white leading-tight">
                    ตรวจพิจารณาเอกสารและลงนามอิเล็กทรอนิกส์
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    การลงนามมีผลผูกพันทางกฎหมายตาม พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemForReview(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-space-lg space-y-space-md overflow-y-auto">
              {/* Top Metadata */}
              <div className="p-space-md bg-surface-container-low rounded-xl border border-border-subtle space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                    {selectedItemForReview.docNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-primary/15 text-amber-primary font-bold">
                    เหลือเวลา SLA: {selectedItemForReview.slaRemainingHours} ชม.
                  </span>
                </div>
                <h4 className="font-bold text-navy-deep text-sm leading-snug">
                  {selectedItemForReview.subject}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-on-surface-variant pt-1">
                  <p><strong>ผู้ยื่นเรื่อง:</strong> {selectedItemForReview.submittedBy}</p>
                  <p><strong>หน่วยงาน:</strong> {selectedItemForReview.dept}</p>
                  <p><strong>วันที่ยื่น:</strong> {selectedItemForReview.submittedAt}</p>
                  <p><strong>ลำดับการพิจารณา:</strong> ขั้นตอนที่ {selectedItemForReview.stepIndex}/{selectedItemForReview.totalSteps}</p>
                </div>
              </div>

              {/* Memo Text Body */}
              <div className="space-y-1.5">
                <span className="font-bold text-navy-deep text-xs block">
                  ข้อความในเอกสาร / บันทึกข้อความ:
                </span>
                <div className="bg-white p-3.5 rounded-lg border border-border-subtle text-xs text-navy-deep leading-relaxed whitespace-pre-line shadow-inner">
                  {selectedItemForReview.content}
                </div>
              </div>

              {/* Attachments */}
              {selectedItemForReview.attachments && selectedItemForReview.attachments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-navy-deep text-xs block">
                    เอกสารหลักฐานแนบ ({selectedItemForReview.attachments.length} รายการ):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedItemForReview.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border-subtle bg-surface-container-low text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-red-500 text-lg">picture_as_pdf</span>
                          <span className="font-medium text-navy-deep truncate">{file.name}</span>
                        </div>
                        <span className="text-outline text-[11px] shrink-0 ml-2">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviewer Note Textarea */}
              <div className="space-y-1.5">
                <label className="font-bold text-navy-deep text-xs block">
                  ความเห็น / ข้อสั่งการของผู้บริหาร (Directive &amp; Feedback):
                </label>
                <textarea
                  rows={3}
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="ระบุข้อสั่งการ เช่น เห็นชอบตามเสนอ ดำเนินการต่อได้ หรือ ระบุเหตุผลในกรณีส่งกลับแก้ไข..."
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-outline"
                ></textarea>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-between gap-space-sm">
              <button
                type="button"
                onClick={() => setSelectedItemForReview(null)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(selectedItemForReview.id, "reject", reviewerNote)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-label-md text-label-md font-semibold border border-border-subtle transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">undo</span>
                  <span>ส่งกลับแก้ไข</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(selectedItemForReview.id, "approve", reviewerNote)}
                  className="px-4 py-2 rounded-lg bg-amber-primary hover:bg-amber-600 text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">draw</span>
                  <span>ลงนามอนุมัติดิจิทัล (Approve &amp; Sign)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
