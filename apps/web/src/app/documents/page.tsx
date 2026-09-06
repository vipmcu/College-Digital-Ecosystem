'use client'

import React, { useState } from "react"
import Link from "next/link"

interface EDocument {
  id: string
  docNumber: string
  title: string
  type: string
  fromDept: string
  createdAt: string
  currentStep: number
  totalSteps: number
  currentApprover: string
  status: "pending_sign" | "in_progress" | "signed" | "rejected"
  checksumSha256: string
}

const initialDocuments: EDocument[] = [
  {
    id: "doc-01",
    docNumber: "มอ 003.2/ว.0142",
    title: "ขออนุมัติจัดโครงการสัมมนาเชิงปฏิบัติการปัญญาประดิษฐ์และคลาวด์สำหรับนักศึกษาชั้นปีที่ 3",
    type: "บันทึกข้อความภายใน (Memo)",
    fromDept: "สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์",
    createdAt: "วันนี้ 08:45 น.",
    currentStep: 2,
    totalSteps: 3,
    currentApprover: "รองคณบดีฝ่ายวิชาการและวิจัย",
    status: "in_progress",
    checksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "doc-02",
    docNumber: "มอ 003.1/10294",
    title: "คำร้องขอลาพักการศึกษาเพื่อเข้าร่วมการแข่งขันระดับนานาชาติ (นายธนภัทร สิริวัฒนกุล)",
    type: "คำร้องออนไลน์ (e-Petition)",
    fromDept: "สำนักทะเบียนและบริการการศึกษา",
    createdAt: "เมื่อวานนี้ 14:20 น.",
    currentStep: 1,
    totalSteps: 3,
    currentApprover: "อาจารย์ที่ปรึกษา / หัวหน้าสาขา",
    status: "pending_sign",
    checksumSha256: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  },
  {
    id: "doc-03",
    docNumber: "มอ 001/08472",
    title: "หนังสือส่งภายนอก: ขอความอนุเคราะห์สถานที่ศึกษาดูงาน ณ ศูนย์เทคโนโลยีอิเล็กทรอนิกส์แห่งชาติ",
    type: "หนังสือส่งภายนอก (Official Letter)",
    fromDept: "สำนักงานคณบดี คณะวิทยาการสารสนเทศ",
    createdAt: "2 ก.ย. 2568",
    currentStep: 3,
    totalSteps: 3,
    currentApprover: "คณบดี (ลงนามเสร็จสิ้น)",
    status: "signed",
    checksumSha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  },
]

export default function DocumentsWorkflowPage() {
  const [docs, setDocs] = useState<EDocument[]>(initialDocuments)
  const [filterTab, setFilterTab] = useState<"all" | "pending_sign" | "in_progress" | "signed">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDocForVerify, setSelectedDocForVerify] = useState<EDocument | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState("บันทึกข้อความภายใน (Memo)")
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  const handleSign = (id: string) => {
    setDocs(
      docs.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "signed",
              currentStep: d.totalSteps,
              currentApprover: "ลงนามดิจิทัล (Digital Signature Validated) เรียบร้อย",
            }
          : d
      )
    )
    setAlertMsg("ลงนามดิจิทัลสำเร็จ (PKI CA Token & SHA-256 Checksum Verified)")
    setTimeout(() => setAlertMsg(null), 4000)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newDocItem: EDocument = {
      id: `doc-${Date.now()}`,
      docNumber: `มอ 003.2/ว.${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      type: newType,
      fromDept: "สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์",
      createdAt: "วันนี้ เพิ่งสร้าง",
      currentStep: 1,
      totalSteps: 3,
      currentApprover: "หัวหน้าสาขาวิชา",
      status: "pending_sign",
      checksumSha256: "7d793037a0760186574b0282f2f435e7",
    }

    setDocs([newDocItem, ...docs])
    setShowCreateModal(false)
    setNewTitle("")
    setAlertMsg(`สร้างเอกสาร ${newDocItem.docNumber} และส่งเข้ากระบวนการเสนอเซ็นเรียบร้อย`)
    setTimeout(() => setAlertMsg(null), 4000)
  }

  const filtered = docs.filter((d) => filterTab === "all" || d.status === filterTab)

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
              <div className="w-8 h-8 rounded-lg bg-amber-primary text-surface-card flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">edit_document</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  e-Document &amp; Workflow
                </span>
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant ml-2">
                  งานสารบรรณอิเล็กทรอนิกส์และลงนามดิจิทัล (M03)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-space-md py-2 bg-amber-primary hover:bg-amber-600 text-surface-card font-label-md text-label-md font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">note_add</span>
            <span>สร้างหนังสือราชการใหม่</span>
          </button>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="w-full bg-surface-canvas flex-1 pb-space-3xl">
        {/* Module Sub-bar */}
        <section className="w-full bg-navy-deep text-on-primary py-space-lg shadow-xs">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
              <div className="space-y-space-2xs">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container text-primary-fixed-dim uppercase tracking-wider">
                    โมดูล M03 • e-Document
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm bg-status-success/20 text-status-success">
                    <span className="material-symbols-outlined text-xs">verified_user</span>
                    CA / PKI Token Active
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm bg-blue-accent/20 text-primary-fixed-dim">
                    <span className="material-symbols-outlined text-xs">key</span>
                    Keycloak SSO เชื่อมต่อแล้ว
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-surface-card tracking-tight font-bold">
                  ระบบงานสารบรรณอิเล็กทรอนิกส์และลงนามดิจิทัล
                </h1>
                <p className="text-xs text-surface-container-high">
                  การจัดการหนังสือราชการไร้กระดาษ 100% พร้อมเส้นทางการเสนอเซ็น 3-5 ลำดับชั้นตามระเบียบงานสารบรรณสำนักนายกรัฐมนตรี
                </p>
              </div>

              <div className="flex items-center gap-space-sm bg-navy-surface/80 p-space-sm rounded-xl border border-navy-surface">
                <span className="material-symbols-outlined text-amber-primary text-2xl">shield</span>
                <div className="text-xs">
                  <div className="font-bold text-surface-card">Digital Signature Engine</div>
                  <div className="text-slate-300">เข้ารหัส SHA-256 + Local Disk Storage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl">
          {/* Toast Notification */}
          {alertMsg && (
            <div className="bg-navy-deep text-surface-card px-space-md py-space-sm rounded-xl shadow-md border border-navy-surface flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-status-success">check_circle</span>
                <span className="font-label-md text-label-md">{alertMsg}</span>
              </div>
              <button onClick={() => setAlertMsg(null)} className="text-surface-container-high hover:text-surface-card">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-space-xs border-b border-border-subtle pb-space-xs overflow-x-auto">
            {[
              { id: "all", label: "เอกสารทั้งหมด", icon: "folder", count: docs.length },
              { id: "pending_sign", label: "รอลงนาม (Inbox)", icon: "edit", count: docs.filter((d) => d.status === "pending_sign").length },
              { id: "in_progress", label: "อยู่ระหว่างเสนอเซ็น", icon: "pending_actions", count: docs.filter((d) => d.status === "in_progress").length },
              { id: "signed", label: "ลงนามเสร็จสิ้นแล้ว", icon: "task_alt", count: docs.filter((d) => d.status === "signed").length },
            ].map((tab) => {
              const isActive = filterTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as typeof filterTab)}
                  className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-on-primary shadow-xs font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-label-sm font-bold ${
                      isActive ? "bg-surface-card/20 text-on-primary" : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Document Cards List */}
          <div className="space-y-space-md">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle hover:border-secondary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-space-md"
              >
                <div className="space-y-space-xs flex-1">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                      {doc.docNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      {doc.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                        doc.status === "signed"
                          ? "bg-status-success/15 text-status-success"
                          : doc.status === "pending_sign"
                          ? "bg-amber-primary/15 text-amber-primary"
                          : "bg-blue-subtle text-secondary"
                      }`}
                    >
                      {doc.status === "signed"
                        ? "ลงนามเสร็จสิ้น"
                        : doc.status === "pending_sign"
                        ? "รอลงนาม"
                        : "กำลังเสนอเซ็น"}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {doc.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-xs text-on-surface-variant">
                    <span>หน่วยงานเจ้าของเรื่อง: <strong className="text-navy-deep">{doc.fromDept}</strong></span>
                    <span>•</span>
                    <span>ส่งเมื่อ: {doc.createdAt}</span>
                    <span>•</span>
                    <span className="font-mono text-outline">SHA: {doc.checksumSha256.substring(0, 12)}...</span>
                  </div>

                  {/* Workflow Progress Tracker */}
                  <div className="pt-space-2xs space-y-1 max-w-md">
                    <div className="flex items-center justify-between text-xs font-semibold text-navy-deep">
                      <span>ขั้นตอนที่ {doc.currentStep} / {doc.totalSteps}: {doc.currentApprover}</span>
                      <span>{Math.round((doc.currentStep / doc.totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          doc.status === "signed" ? "bg-status-success" : "bg-amber-primary"
                        }`}
                        style={{ width: `${(doc.currentStep / doc.totalSteps) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-space-sm shrink-0">
                  <button
                    onClick={() => setSelectedDocForVerify(doc)}
                    className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>ดูเอกสาร</span>
                  </button>

                  {doc.status !== "signed" && (
                    <button
                      onClick={() => handleSign(doc.id)}
                      className="px-space-md py-2 rounded-lg bg-amber-primary hover:bg-status-warning text-surface-card font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">draw</span>
                      <span>ลงนามดิจิทัล</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl max-w-xl w-full p-space-xl shadow-2xl border border-border-subtle space-y-space-md">
            <div className="flex items-center justify-between border-b border-border-subtle pb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                สร้างหนังสือราชการใหม่ (M03-F01)
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-navy-deep">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-space-md">
              <div>
                <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                  ประเภทหนังสือราชการ
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="บันทึกข้อความภายใน (Memo)">บันทึกข้อความภายใน (Memo)</option>
                  <option value="หนังสือส่งภายนอก (Official Letter)">หนังสือส่งภายนอก (Official Letter)</option>
                  <option value="คำร้องออนไลน์ (e-Petition)">คำร้องขอหนังสือรับรอง / คำร้องออนไลน์</option>
                </select>
              </div>

              <div>
                <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                  เรื่อง / หัวข้อหนังสือ
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ขออนุมัติจัดโครงการสัมมนาเชิงวิชาการ..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-primary hover:bg-amber-600 text-surface-card font-label-md text-label-md font-semibold shadow-xs"
                >
                  บันทึกและส่งเสนอเซ็น
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {selectedDocForVerify && (
        <div className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card rounded-2xl max-w-xl w-full shadow-2xl border border-border-subtle overflow-hidden">
            {/* Modal Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-primary text-2xl">verified</span>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-white leading-tight">
                    ตรวจสอบต้นฉบับเอกสารดิจิทัล
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    Digital Signature &amp; Integrity Verification (M03-F04)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDocForVerify(null)
                  setCopiedHash(false)
                }}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-space-lg space-y-space-md">
              {/* Document Info Card */}
              <div className="bg-surface-container-low p-space-md rounded-xl border border-border-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {selectedDocForVerify.docNumber}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-status-success/15 text-status-success flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    ลายเซ็นดิจิทัลสมบูรณ์ (ETDA Valid)
                  </span>
                </div>
                <h4 className="font-bold text-navy-deep text-sm leading-snug">
                  {selectedDocForVerify.title}
                </h4>
                <div className="text-xs text-on-surface-variant flex flex-wrap gap-x-4 gap-y-1 pt-1">
                  <span><strong>ประเภท:</strong> {selectedDocForVerify.type}</span>
                  <span><strong>หน่วยงาน:</strong> {selectedDocForVerify.fromDept}</span>
                  <span><strong>วันที่ออก:</strong> {selectedDocForVerify.createdAt}</span>
                </div>
              </div>

              {/* SHA-256 Checksum Block */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-deep flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">fingerprint</span>
                    SHA-256 Cryptographic Checksum (ลายพิมพ์ดิจิทัล)
                  </span>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(selectedDocForVerify.checksumSha256)
                      }
                      setCopiedHash(true)
                      setTimeout(() => setCopiedHash(false), 2500)
                    }}
                    className="text-primary hover:text-navy-deep font-semibold flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {copiedHash ? "done" : "content_copy"}
                    </span>
                    <span>{copiedHash ? "คัดลอกแล้ว!" : "คัดลอกรหัส"}</span>
                  </button>
                </div>
                <div className="bg-navy-deep text-emerald-400 p-3 rounded-xl font-mono text-xs break-all select-all border border-navy-surface shadow-inner">
                  {selectedDocForVerify.checksumSha256}
                </div>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-xs text-status-success">shield</span>
                  ต้นฉบับผ่านการตรวจสอบความครบถ้วนสมบูรณ์ (Data Integrity &amp; Non-repudiation)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
              <button
                onClick={() => {
                  setSelectedDocForVerify(null)
                  setCopiedHash(false)
                }}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  setAlertMsg(`ดาวน์โหลดสำเนาอิเล็กทรอนิกส์ ${selectedDocForVerify.docNumber} เรียบร้อย (Certified Copy)`)
                  setSelectedDocForVerify(null)
                  setTimeout(() => setAlertMsg(null), 4000)
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>ดาวน์โหลดสำเนารับรอง</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-md border-t border-navy-surface mt-auto">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-primary-fixed-dim">
          <span>College e-Document System • Digital Signatures &amp; Workflows</span>
          <span>&copy; 2569 งานสารบรรณและนิติการ มหาวิทยาลัย</span>
        </div>
      </footer>
    </div>
  )
}
