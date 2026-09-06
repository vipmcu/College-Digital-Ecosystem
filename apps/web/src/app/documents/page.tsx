'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface DocumentAttachment {
  name: string
  size: string
}

interface AuditTrailStep {
  step: number
  title: string
  role: string
  name: string
  signedAt: string
  status: "completed" | "pending" | "waiting"
}

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
  content?: string
  attachments?: DocumentAttachment[]
  auditTrail?: AuditTrailStep[]
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
    content:
      "ด้วย สาขาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์ มีความประสงค์จัดโครงการสัมมนาเชิงปฏิบัติการปัญญาประดิษฐ์และคลาวด์สำหรับนักศึกษาชั้นปีที่ 3 เพื่อเสริมสร้างทักษะการประยุกต์ใช้ Generative AI และ Cloud Architecture ในอุตสาหกรรมจริง ระหว่างวันที่ 15-17 ตุลาคม 2569 ณ อาคารนวัตกรรมดิจิทัล จึงใคร่ขออนุมัติจัดโครงการและเบิกจ่ายงบประมาณตามที่แนบมาพร้อมนี้",
    attachments: [
      { name: "โครงการสัมมนา_AI_Cloud_2569.pdf", size: "2.4 MB" },
      { name: "ประมาณการค่าใช้จ่ายและวิทยากรภายนอก.pdf", size: "1.1 MB" },
    ],
    auditTrail: [
      {
        step: 1,
        title: "ผู้เสนอเรื่อง / หัวหน้าสาขาวิชา",
        role: "หัวหน้าสาขาวิทยาการคอมพิวเตอร์",
        name: "ผศ.ดร. นภนต์ จิตต์วิรุฬห์",
        signedAt: "เมื่อวานนี้ 09:30 น.",
        status: "completed",
      },
      {
        step: 2,
        title: "ผู้พิจารณากลั่นกรอง",
        role: "รองคณบดีฝ่ายวิชาการและวิจัย",
        name: "รศ.ดร. สุรพงษ์ แก้ววิเชียร",
        signedAt: "อยู่ระหว่างพิจารณา (In Review)",
        status: "pending",
      },
      {
        step: 3,
        title: "ผู้อนุมัติขั้นสุดท้าย",
        role: "คณบดีคณะวิทยาการสารสนเทศ",
        name: "ศ.ดร. ธีรเดช วงศ์สวรรค์",
        signedAt: "รอลำดับก่อนหน้าอนุมัติ",
        status: "waiting",
      },
    ],
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
    content:
      "ข้าพเจ้านายธนภัทร สิริวัฒนกุล รหัสนักศึกษา 6601104567 สังกัดสาขาวิศวกรรมซอฟต์แวร์ มีความประสงค์ขอลาพักการศึกษาในภาคการศึกษาที่ 1/2569 เป็นเวลา 1 ภาคการศึกษา เพื่อเข้าร่วมการแข่งขันพัฒนาหุ่นยนต์ปัญญาประดิษฐ์ระดับโลก ณ กรุงโตเกียว ประเทศญี่ปุ่น ในฐานะตัวแทนเยาวชนทีมชาติไทย โดยได้แนบหนังสือเชิญและเอกสารรับรองมาพร้อมนี้",
    attachments: [
      { name: "หนังสือเชิญการแข่งขันระดับนานาชาติ_Official.pdf", size: "3.2 MB" },
      { name: "หนังสือรับรองจากสมาคมปัญญาประดิษฐ์.pdf", size: "850 KB" },
    ],
    auditTrail: [
      {
        step: 1,
        title: "อาจารย์ที่ปรึกษา",
        role: "อาจารย์ที่ปรึกษาทางวิชาการ",
        name: "ดร. วิชัย มุ่งมั่น",
        signedAt: "รอดำเนินการลงนาม (Pending)",
        status: "pending",
      },
      {
        step: 2,
        title: "หัวหน้าภาควิชา",
        role: "หัวหน้าภาควิชาวิศวกรรมซอฟต์แวร์",
        name: "รศ.ดร. ประเสริฐ ยั่งยืน",
        signedAt: "รอลำดับก่อนหน้าอนุมัติ",
        status: "waiting",
      },
      {
        step: 3,
        title: "ผู้อำนวยการสำนักส่งเสริมวิชาการ",
        role: "นายทะเบียนมหาวิทยาลัย",
        name: "ดร. นิมิต โสภณ",
        signedAt: "รอลำดับก่อนหน้าอนุมัติ",
        status: "waiting",
      },
    ],
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
    content:
      "เรียน ผู้อำนวยการศูนย์เทคโนโลยีอิเล็กทรอนิกส์และคอมพิวเตอร์แห่งชาติ (NECTEC)\nเรื่อง ขอความอนุเคราะห์นำคณาจารย์และนักศึกษาเข้าศึกษาดูงานระบบ Supercomputing และ AI Infrastructure\nตามที่คณะวิทยาการสารสนเทศ มุ่งเน้นการจัดการเรียนการสอนแบบเน้นสมรรถนะ คณะฯ จึงใคร่ขอความอนุเคราะห์นำนักศึกษาชั้นปีที่ 4 จำนวน 45 คน เข้าศึกษาดูงานศูนย์ข้อมูล National Supercomputing Center ในวันศุกร์ที่ 28 พฤศจิกายน 2569 เวลา 09.00 - 12.00 น.",
    attachments: [
      { name: "หนังสือขอความอนุเคราะห์_NECTEC_Official.pdf", size: "1.8 MB" },
      { name: "รายชื่อคณะอาจารย์และนักศึกษาดูงาน.pdf", size: "920 KB" },
    ],
    auditTrail: [
      {
        step: 1,
        title: "หัวหน้างานสารบรรณ",
        role: "หัวหน้างานสารบรรณและนิติการ",
        name: "นางกานดา ศรีสวัสดิ์",
        signedAt: "1 ก.ย. 2568 10:00 น.",
        status: "completed",
      },
      {
        step: 2,
        title: "รองคณบดีฝ่ายบริหาร",
        role: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์",
        name: "รศ.ดร. อนุชา วัฒนา",
        signedAt: "2 ก.ย. 2568 11:30 น.",
        status: "completed",
      },
      {
        step: 3,
        title: "คณบดีคณะวิทยาการสารสนเทศ",
        role: "คณบดี",
        name: "ศ.ดร. ธีรเดช วงศ์สวรรค์",
        signedAt: "2 ก.ย. 2568 15:45 น.",
        status: "completed",
      },
    ],
  },
]

export default function DocumentsWorkflowPage() {
  const [docs, setDocs] = useState<EDocument[]>(initialDocuments)
  const [filterTab, setFilterTab] = useState<"all" | "pending_sign" | "in_progress" | "signed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<EDocument | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState("บันทึกข้อความภายใน (Memo)")
  const [newContent, setNewContent] = useState("")
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const filterParam = params.get("filter")
      if (filterParam && ["all", "pending_sign", "in_progress", "signed"].includes(filterParam)) {
        setFilterTab(filterParam as typeof filterTab)
      }
    }
  }, [])

  const handleSign = (id: string) => {
    setDocs(
      docs.map((d) => {
        if (d.id === id) {
          const updatedTrail = d.auditTrail?.map((step) =>
            step.status === "pending"
              ? { ...step, status: "completed" as const, signedAt: "เพิ่งลงนามเสร็จสิ้น (Just signed)" }
              : step
          )
          return {
            ...d,
            status: "signed",
            currentStep: d.totalSteps,
            currentApprover: "ลงนามดิจิทัล (Digital Signature Validated) เรียบร้อย",
            auditTrail: updatedTrail,
          }
        }
        return d
      })
    )
    if (selectedDocForDetail && selectedDocForDetail.id === id) {
      setSelectedDocForDetail({
        ...selectedDocForDetail,
        status: "signed",
        currentStep: selectedDocForDetail.totalSteps,
        currentApprover: "ลงนามดิจิทัล (Digital Signature Validated) เรียบร้อย",
      })
    }
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
      content: newContent || "เอกสารเสนอเรื่องเพื่อพิจารณาดำเนินการตามระเบียบงานสารบรรณ",
      attachments: [{ name: "เอกสารแนบประกอบการพิจารณา.pdf", size: "1.5 MB" }],
      auditTrail: [
        {
          step: 1,
          title: "ผู้เสนอเรื่อง",
          role: "ผู้ขออนุมัติ",
          name: "ผู้ใช้งานปัจจุบัน",
          signedAt: "วันนี้ เพิ่งส่งเสนอเซ็น",
          status: "completed",
        },
        {
          step: 2,
          title: "หัวหน้าหน่วยงาน",
          role: "หัวหน้าสาขาวิชา",
          name: "ผศ.ดร. นภนต์ จิตต์วิรุฬห์",
          signedAt: "รอดำเนินการ",
          status: "pending",
        },
        {
          step: 3,
          title: "ผู้มีอำนาจลงนาม",
          role: "คณบดี",
          name: "ศ.ดร. ธีรเดช วงศ์สวรรค์",
          signedAt: "รอลำดับถัดไป",
          status: "waiting",
        },
      ],
    }

    setDocs([newDocItem, ...docs])
    setShowCreateModal(false)
    setNewTitle("")
    setNewContent("")
    setAlertMsg(`สร้างเอกสาร ${newDocItem.docNumber} และส่งเข้ากระบวนการเสนอเซ็นเรียบร้อย`)
    setTimeout(() => setAlertMsg(null), 4000)
  }

  const filtered = docs.filter((d) => {
    const matchesTab = filterTab === "all" || d.status === filterTab
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q === "" ||
      d.title.toLowerCase().includes(q) ||
      d.docNumber.toLowerCase().includes(q) ||
      d.fromDept.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

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

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            {/* Filter Tabs */}
            <div className="flex items-center gap-space-xs border-b md:border-b-0 border-border-subtle pb-space-xs md:pb-0 overflow-x-auto">
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

            {/* Live Search Bar */}
            <div className="relative min-w-[260px] md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเลขที่หนังสือ, ชื่อเรื่อง, หน่วยงาน..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-border-subtle bg-surface-card text-navy-deep text-xs focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-outline"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-navy-deep"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Document Cards List */}
          <div className="space-y-space-md">
            {filtered.length === 0 ? (
              <div className="bg-surface-card p-12 rounded-xl text-center border border-border-subtle">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">find_in_page</span>
                <p className="font-bold text-navy-deep">ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา</p>
                <p className="text-xs text-outline mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่</p>
              </div>
            ) : (
              filtered.map((doc) => (
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
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      <span>ดูเอกสารฉบับเต็ม</span>
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
              ))
            )}
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
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-navy-deep cursor-pointer">
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
                  เรื่อง / หัวข้อหนังสือ <span className="text-red-500">*</span>
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

              <div>
                <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                  ข้อความบันทึก / เนื้อหาสำคัญ
                </label>
                <textarea
                  rows={3}
                  placeholder="ระบุใจความสำคัญของหนังสือราชการเพื่อเสนอผู้บริหารพิจารณา..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-primary hover:bg-amber-600 text-surface-card font-label-md text-label-md font-semibold shadow-xs cursor-pointer"
                >
                  บันทึกและส่งเสนอเซ็น
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Document Detail & Signing Audit Trail Modal */}
      {selectedDocForDetail && (
        <div className="fixed inset-0 z-50 bg-navy-deep/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface-card rounded-2xl max-w-2xl w-full shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-primary text-2xl">description</span>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-white leading-tight">
                    เอกสารราชการอิเล็กทรอนิกส์ &amp; บันทึกลายมือชื่อดิจิทัล
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    ระบบงานสารบรรณ มหาวิทยาลัยสารสนเทศ • M03 Digital Document
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDocForDetail(null)
                  setCopiedHash(false)
                }}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-space-lg space-y-space-md overflow-y-auto">
              {/* Official Memo Header Box */}
              <div className="border border-border-subtle rounded-xl p-space-md bg-surface-container-low/40 space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-deep text-sm">บันทึกข้อความ</span>
                    <span className="text-xs text-on-surface-variant">({selectedDocForDetail.type})</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {selectedDocForDetail.docNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-outline">ส่วนราชการ:</span>{" "}
                    <strong className="text-navy-deep">{selectedDocForDetail.fromDept}</strong>
                  </div>
                  <div>
                    <span className="text-outline">วันที่:</span>{" "}
                    <span className="text-navy-deep font-medium">{selectedDocForDetail.createdAt}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-outline">เรื่อง:</span>{" "}
                    <strong className="text-navy-deep">{selectedDocForDetail.title}</strong>
                  </div>
                </div>

                {/* Memo Content Body */}
                <div className="bg-white p-3.5 rounded-lg border border-border-subtle text-xs text-navy-deep leading-relaxed whitespace-pre-line shadow-inner">
                  {selectedDocForDetail.content || "ไม่มีข้อความเพิ่มเติม"}
                </div>
              </div>

              {/* Attachments */}
              {selectedDocForDetail.attachments && selectedDocForDetail.attachments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-navy-deep text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">attachment</span>
                    เอกสารแนบประกอบ ({selectedDocForDetail.attachments.length} รายการ)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDocForDetail.attachments.map((file, idx) => (
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

              {/* Signing Audit Trail (Workflow Hierarchy) */}
              <div className="space-y-2">
                <span className="font-bold text-navy-deep text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">timeline</span>
                  ลำดับขั้นการเสนอเซ็นและประวัติการลงนามดิจิทัล (Signing Audit Trail)
                </span>
                <div className="border border-border-subtle rounded-xl divide-y divide-border-subtle overflow-hidden">
                  {(selectedDocForDetail.auditTrail || []).map((trail) => (
                    <div
                      key={trail.step}
                      className={`p-3 flex items-center justify-between gap-3 text-xs ${
                        trail.status === "completed"
                          ? "bg-emerald-500/5"
                          : trail.status === "pending"
                          ? "bg-amber-primary/5"
                          : "bg-surface-canvas/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            trail.status === "completed"
                              ? "bg-emerald-600 text-white"
                              : trail.status === "pending"
                              ? "bg-amber-primary text-white"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          {trail.status === "completed" ? "✓" : trail.step}
                        </div>
                        <div>
                          <p className="font-bold text-navy-deep">{trail.name}</p>
                          <p className="text-[11px] text-outline">{trail.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            trail.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : trail.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          {trail.status === "completed"
                            ? "ลงนามเรียบร้อย"
                            : trail.status === "pending"
                            ? "อยู่ระหว่างพิจารณา"
                            : "รอลำดับถัดไป"}
                        </span>
                        <p className="text-[10px] text-outline mt-0.5">{trail.signedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHA-256 Checksum Block */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-deep flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">fingerprint</span>
                    SHA-256 Checksum (ETDA &amp; Non-repudiation Certified)
                  </span>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(selectedDocForDetail.checksumSha256)
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
                <div className="bg-navy-deep text-emerald-400 p-2.5 rounded-xl font-mono text-xs break-all select-all border border-navy-surface">
                  {selectedDocForDetail.checksumSha256}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
              <button
                onClick={() => {
                  setSelectedDocForDetail(null)
                  setCopiedHash(false)
                }}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>

              {selectedDocForDetail.status !== "signed" && (
                <button
                  onClick={() => handleSign(selectedDocForDetail.id)}
                  className="px-4 py-2 rounded-lg bg-amber-primary hover:bg-amber-600 text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">draw</span>
                  <span>ลงนามดิจิทัลทันที</span>
                </button>
              )}

              <button
                onClick={() => {
                  window.print()
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>พิมพ์ / ส่งออกสำเนารับรอง</span>
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
