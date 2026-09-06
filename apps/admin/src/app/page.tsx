'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

interface ServiceMetric {
  name: string
  port: number
  status: "UP" | "DOWN"
  latencyMs: number
  description: string
}

interface AuditLogItem {
  id: string
  action: string
  resourceType: string
  userId: string
  eventTime: string
  status: "SUCCESS" | "WARNING" | "INFO"
}

export default function ExecutiveDashboardPage() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2568-1")
  const [selectedFaculty, setSelectedFaculty] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("3m")
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "edoc" | "adoption" | "budget">("overview")
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const servicesList: ServiceMetric[] = [
    { name: "M01 Identity & Auth Service", port: 4001, status: "UP", latencyMs: 14, description: "Fastify, Keycloak SSO, RBAC Matrix" },
    { name: "M02 SIS Academic Service", port: 4002, status: "UP", latencyMs: 19, description: "Registration Engine, Atomic Seat Lock" },
    { name: "M03 Document Workflow Service", port: 4003, status: "UP", latencyMs: 16, description: "Digital Signatures, State Machine" },
    { name: "M04 Analytics Metrics Service", port: 4004, status: "UP", latencyMs: 8, description: "KPI Aggregator, SLA Engine" },
    { name: "M05 Notification Queue Service", port: 4005, status: "UP", latencyMs: 12, description: "Event-driven Alert Dispatcher" },
    { name: "API Gateway Reverse Proxy", port: 4000, status: "UP", latencyMs: 4, description: "Dynamic Fastify Upstream Router" },
  ]

  const recentAuditLogs: AuditLogItem[] = [
    { id: "LOG-9821", action: "USER_LOGIN_SUCCESS", resourceType: "users", userId: "admin", eventTime: "10:32:15", status: "SUCCESS" },
    { id: "LOG-9820", action: "STUDENT_ENROLL_SEAT_LOCKED", resourceType: "enrollments", userId: "student01", eventTime: "10:31:40", status: "SUCCESS" },
    { id: "LOG-9819", action: "PII_DECRYPT_ACCESS", resourceType: "students", userId: "admin", eventTime: "10:29:12", status: "INFO" },
    { id: "LOG-9818", action: "DOCUMENT_DIGITAL_SIGNED", resourceType: "documents", userId: "instructor01", eventTime: "10:25:04", status: "SUCCESS" },
    { id: "LOG-9817", action: "WORKFLOW_STEP_TRANSITION", resourceType: "workflow_steps", userId: "admin", eventTime: "10:18:50", status: "SUCCESS" },
  ]

  const facultyData: Record<
    string,
    {
      name: string
      headcount: string
      normalStudents: string
      leaveStudents: string
      normalPercent: string
      leavePercent: string
      slaHours: string
      slaFaster: string
      signedCount: string
      pendingCount: string
      signedPercent: string
      adoptionPercent: string
      activeUsersDay: string
    }
  > = {
    all: {
      name: "ภาพรวมวิทยาลัย (ทุกส่วนงาน)",
      headcount: "5,840",
      normalStudents: "5,536",
      leaveStudents: "304",
      normalPercent: "94.8%",
      leavePercent: "5.2%",
      slaHours: "4.2",
      slaFaster: "65%",
      signedCount: "1,842",
      pendingCount: "238",
      signedPercent: "88.6%",
      adoptionPercent: "88.4%",
      activeUsersDay: "4,210",
    },
    cs: {
      name: "สาขาวิทยาการคอมพิวเตอร์",
      headcount: "1,820",
      normalStudents: "1,750",
      leaveStudents: "70",
      normalPercent: "96.2%",
      leavePercent: "3.8%",
      slaHours: "2.8",
      slaFaster: "72%",
      signedCount: "680",
      pendingCount: "42",
      signedPercent: "94.2%",
      adoptionPercent: "95.6%",
      activeUsersDay: "1,480",
    },
    it: {
      name: "สาขาเทคโนโลยีสารสนเทศ",
      headcount: "2,350",
      normalStudents: "2,210",
      leaveStudents: "140",
      normalPercent: "94.0%",
      leavePercent: "6.0%",
      slaHours: "4.5",
      slaFaster: "60%",
      signedCount: "740",
      pendingCount: "115",
      signedPercent: "86.5%",
      adoptionPercent: "85.2%",
      activeUsersDay: "1,650",
    },
    ai: {
      name: "สาขาปัญญาประดิษฐ์และวิทยาการข้อมูล",
      headcount: "1,670",
      normalStudents: "1,576",
      leaveStudents: "94",
      normalPercent: "94.4%",
      leavePercent: "5.6%",
      slaHours: "3.1",
      slaFaster: "69%",
      signedCount: "422",
      pendingCount: "81",
      signedPercent: "83.9%",
      adoptionPercent: "92.0%",
      activeUsersDay: "1,080",
    },
  }

  const handleExportBriefing = () => {
    setExportNotice("กำลังเตรียมพิมพ์เอกสารรายงานยุทธศาสตร์ PDF Briefing (M04-F04)...")
    if (typeof window !== "undefined") {
      window.print()
    }
    setTimeout(() => {
      setExportNotice("เปิดหน้าต่างพิมพ์รายงานสรุปยุทธศาสตร์ (PDF Briefing) เรียบร้อย")
      setTimeout(() => setExportNotice(null), 4000)
    }, 1000)
  }

  const handleExportData = () => {
    const current = facultyData[selectedFaculty] || facultyData.all
    const rows = [
      ["College Executive Analytics Report", `Year: ${selectedYear}`, `Faculty: ${current.name}`],
      ["Generated At", new Date().toLocaleString("th-TH")],
      [],
      ["Metric Name", "Value", "Unit", "Benchmark Status"],
      ["จำนวนนักศึกษาปัจจุบัน (Headcount)", current.headcount, "คน", "ปกติ"],
      ["นักศึกษาสภาพปกติ", current.normalStudents, `คน (${current.normalPercent})`, "คงอยู่"],
      ["นักศึกษาลาพัก/ผ่อนผัน", current.leaveStudents, `คน (${current.leavePercent})`, "ติดตาม"],
      ["ระยะเวลาอนุมัติคำร้องเฉลี่ย (SLA)", current.slaHours, "ชั่วโมง/ฉบับ", `เร็วกว่าเป้าหมาย ${current.slaFaster}`],
      ["เกษียณหนังสือเสร็จสิ้น", current.signedCount, `ฉบับ (${current.signedPercent})`, "เสร็จสมบูรณ์"],
      ["เอกสารรอลงนามคงค้าง", current.pendingCount, "ฉบับ", "อยู่ในเกณฑ์"],
      ["อัตราการยอมรับและใช้งานดิจิทัล", `${current.adoptionPercent}`, "%", "บรรลุเป้าหมาย"],
      ["ผู้ใช้งานสม่ำเสมอต่อวัน", current.activeUsersDay, "คน/วัน", "Active"],
      ["เสถียรภาพระบบไอที (System Uptime)", "99.98%", "%", "High Availability"],
      [],
      ["Service Status", "Port", "Latency", "State"],
      ...servicesList.map((s) => [s.name, s.port.toString(), `${s.latencyMs}ms`, s.status]),
      [],
      ["Recent Audit Log ID", "Action", "Resource", "User", "Timestamp", "Status"],
      ...recentAuditLogs.map((l) => [l.id, l.action, l.resourceType, l.userId, l.eventTime, l.status]),
    ]

    const csvContent =
      "\uFEFF" +
      rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `executive_metrics_${selectedFaculty}_${selectedYear}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportNotice("ส่งออกชุดข้อมูล Excel/CSV เรียบร้อย (executive_metrics.csv)")
    setTimeout(() => setExportNotice(null), 4000)
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* 1. Top Fixed Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-card/95 backdrop-blur-md shadow-[0_1px_8px_rgba(11,38,119,0.06)] border-b border-border-subtle">
        <div className="h-16 max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-space-sm text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-navy-deep text-amber-primary flex items-center justify-center font-bold shadow-md border border-navy-surface">
                <span className="material-symbols-outlined text-2xl text-amber-primary">analytics</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                  College Executive Portal
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                  Admin Console &amp; Observability • M04
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-space-lg h-full">
            <Link
              href="/"
              className="py-space-md transition-colors text-secondary border-b-2 border-secondary font-label-lg"
            >
              แดชบอร์ดผู้บริหาร
            </Link>
            <Link
              href="/users"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              จัดการผู้ใช้งาน &amp; PDPA
            </Link>
            <Link
              href="/approvals"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              คิวอนุมัติคำร้อง
            </Link>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors flex items-center gap-1"
            >
              <span>สู่หน้า Web Portal</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </nav>

          {/* Admin User Profile */}
          <div className="flex items-center gap-space-md">
            {mounted && session?.user ? (
              <div className="flex items-center gap-space-sm">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center justify-end gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      {session.user.name || session.user.username}
                    </span>
                    <span className="px-1.5 py-0.2 bg-navy-deep text-amber-subtle font-label-sm text-label-sm rounded uppercase font-bold">
                      {session.user.roles?.[0] || "IT ADMIN"}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-sm text-label-sm flex items-center gap-1 border border-border-subtle transition-colors cursor-pointer"
                  title="ออกจากระบบ"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-navy-deep hover:bg-navy-surface text-surface-card font-label-md text-label-md font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>เข้าสู่ระบบ Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Executive Body */}
      <main className="w-full pt-16 bg-surface-canvas flex-1 pb-space-3xl">
        {/* Toast Export Notification */}
        {exportNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-navy-deep text-surface-card px-space-md py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm border border-navy-surface animate-bounce">
            <span className="material-symbols-outlined text-amber-primary">info</span>
            <span className="font-body-sm text-body-sm">{exportNotice}</span>
          </div>
        )}

        {/* Top Command Bar & Executive Context Header */}
        <div className="w-full bg-navy-deep text-on-primary py-space-xl relative overflow-hidden">
          {/* Ambient Executive Glow */}
          <div className="absolute -right-16 -top-24 w-96 h-96 rounded-full bg-navy-surface/40 blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-blue-accent/10 blur-2xl pointer-events-none"></div>

          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
            {/* Breadcrumb & RBAC Badge */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-primary/20 text-amber-subtle font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-primary animate-ping"></span>
                  โมดูล M04 • Executive BI &amp; Analytics
                </span>
                <span className="text-primary-fixed-dim/40">•</span>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified_user</span>
                  ระดับผู้บริหาร (Deans &amp; Academic Directors)
                </span>
                <span className="text-primary-fixed-dim/40">•</span>
                <span className="font-label-sm text-label-sm text-status-success flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-xs">sync</span>
                  Data Synced: Live Real-time (M01-M06)
                </span>
              </div>

              {/* Executive Fast Actions (Export F04) */}
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={handleExportBriefing}
                  className="px-space-sm py-1.5 rounded bg-surface-card/10 hover:bg-surface-card/20 text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-amber-primary">picture_as_pdf</span>
                  <span>ส่งออกรายงานสรุปยุทธศาสตร์ (PDF Briefing)</span>
                </button>
                <button
                  onClick={handleExportData}
                  className="px-space-sm py-1.5 rounded bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">table_view</span>
                  <span>ดาวน์โหลดชุดข้อมูล (Excel/CSV)</span>
                </button>
              </div>
            </div>

            {/* Main Title & Strategic Selector Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pt-space-xs">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-surface-card tracking-tight font-bold">
                  แดชบอร์ดภาพรวมและสารสนเทศเชิงยุทธศาสตร์สำหรับผู้บริหาร
                </h1>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-1 max-w-3xl">
                  College Executive Strategic Cockpit • ศูนย์รวมการติดตามดัชนีชี้วัดเป้าหมายหลัก (OKRs), การเคลื่อนไหวของนักศึกษา (SIS), ประสิทธิภาพการบริหารงานสารบรรณดิจิทัล (e-Doc SLA) และการยอมรับระบบนิเวศไอทีระดับมหาวิทยาลัย
                </p>
              </div>

              {/* Strategic Filter Scope Controls */}
              <div className="flex flex-wrap items-center gap-space-xs bg-navy-surface/60 p-1.5 rounded-xl shadow-inner border border-navy-surface/50">
                <div className="flex items-center gap-1 px-space-xs py-1 rounded bg-navy-deep/80 text-primary-fixed">
                  <span className="material-symbols-outlined text-sm text-amber-primary">calendar_today</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-transparent font-label-sm text-label-sm text-surface-card focus:outline-none cursor-pointer pr-1"
                  >
                    <option className="bg-navy-deep text-surface-card" value="2568-1">ปีการศึกษา 2568 (ภาค 1/2568)</option>
                    <option className="bg-navy-deep text-surface-card" value="2567-2">ปีการศึกษา 2567 (ภาค 2/2567)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 px-space-xs py-1 rounded bg-navy-deep/80 text-primary-fixed">
                  <span className="material-symbols-outlined text-sm text-secondary-container">domain</span>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="bg-transparent font-label-sm text-label-sm text-surface-card focus:outline-none cursor-pointer pr-1"
                  >
                    <option className="bg-navy-deep text-surface-card" value="all">ภาพรวมวิทยาลัย (ทุกส่วนงาน)</option>
                    <option className="bg-navy-deep text-surface-card" value="cs">สาขาวิทยาการคอมพิวเตอร์</option>
                    <option className="bg-navy-deep text-surface-card" value="it">สาขาเทคโนโลยีสารสนเทศ</option>
                    <option className="bg-navy-deep text-surface-card" value="ai">สาขาปัญญาประดิษฐ์และวิทยาการข้อมูล</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 px-space-xs py-1 rounded bg-navy-deep/80 text-primary-fixed">
                  <span className="material-symbols-outlined text-sm text-outline-variant">timelapse</span>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="bg-transparent font-label-sm text-label-sm text-surface-card focus:outline-none cursor-pointer pr-1"
                  >
                    <option className="bg-navy-deep text-surface-card" value="3m">แนวโน้ม 3 เดือนล่าสุด</option>
                    <option className="bg-navy-deep text-surface-card" value="yoy">เปรียบเทียบเทียบปีต่อปี (YoY)</option>
                    <option className="bg-navy-deep text-surface-card" value="month">เดือนปัจจุบัน</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Strategic Sub-navigation Tabs */}
            <div className="flex items-center gap-space-xs mt-space-lg overflow-x-auto">
              {[
                { id: "overview", label: "ภาพรวมยุทธศาสตร์ (Overview)", icon: "dashboard" },
                { id: "students", label: "สถิตินักศึกษา & การลงทะเบียน (M04-F01)", icon: "school" },
                { id: "edoc", label: "ประสิทธิภาพสารบรรณ & SLA (M04-F02)", icon: "history_edu" },
                { id: "adoption", label: "อัตราการยอมรับระบบดิจิทัล (M04-F03)", icon: "trending_up" },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-space-md py-space-xs rounded-t-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-surface-canvas text-primary font-bold shadow-xs"
                        : "bg-navy-surface/40 hover:bg-navy-surface/80 text-primary-fixed-dim hover:text-surface-card"
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

        {/* Main Strategic Analytics Content Area */}
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop w-full -mt-4 space-y-space-xl">
          {/* Top Strategic KPI Cards Row */}
          {(() => {
            const currFaculty = facultyData[selectedFaculty] || facultyData.all
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* KPI 1: Active Students Headcount */}
                <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                        M04-F01 • ฐานข้อมูลนักศึกษา
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold mt-0.5">
                        จำนวนนักศึกษาปัจจุบัน
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-subtle text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined">groups</span>
                    </div>
                  </div>

                  <div className="my-space-sm flex items-baseline justify-between">
                    <div>
                      <span className="font-display-lg text-display-lg text-navy-deep font-bold tracking-tight">
                        {currFaculty.headcount}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold">
                        คน
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span> +4.2% YoY
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                      <div className="bg-secondary h-full" style={{ width: currFaculty.normalPercent }} title={`คงสภาพ: ${currFaculty.normalPercent}`}></div>
                      <div className="bg-status-warning h-full" style={{ width: currFaculty.leavePercent }} title={`พัก/ผ่อนผัน: ${currFaculty.leavePercent}`}></div>
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>สภาพปกติ {currFaculty.normalStudents} คน ({currFaculty.normalPercent})</span>
                      <span className="text-status-warning font-semibold">พัก/ผ่อนผัน {currFaculty.leaveStudents} คน ({currFaculty.leavePercent})</span>
                    </div>
                  </div>
                </div>

                {/* KPI 2: e-Document SLA */}
                <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-primary"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                        M04-F02 • ประสิทธิภาพสารบรรณ
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold mt-0.5">
                        ระยะเวลาอนุมัติคำร้อง (SLA)
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-subtle text-amber-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">timer</span>
                    </div>
                  </div>

                  <div className="my-space-sm flex items-baseline justify-between">
                    <div>
                      <span className="font-display-lg text-display-lg text-navy-deep font-bold tracking-tight">
                        {currFaculty.slaHours}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold">
                        ชั่วโมง/ฉบับ
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">bolt</span> เร็วกว่าเป้าหมาย {currFaculty.slaFaster}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                      <div className="bg-amber-primary h-full" style={{ width: currFaculty.signedPercent }} title={`เสร็จสิ้นตาม SLA: ${currFaculty.signedPercent}`}></div>
                      <div className="bg-outline-variant h-full" style={{ width: `${100 - parseFloat(currFaculty.signedPercent)}%` }} title="รอดำเนินการ"></div>
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>เกษียณเสร็จสิ้น {currFaculty.signedCount} ฉบับ ({currFaculty.signedPercent})</span>
                      <span className="text-amber-primary font-semibold">รอลงนาม {currFaculty.pendingCount} ฉบับ</span>
                    </div>
                  </div>
                </div>

                {/* KPI 3: Digital Adoption Rate */}
                <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-status-success"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                        M04-F03 • การยอมรับระบบดิจิทัล
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold mt-0.5">
                        อัตราการยอมรับและใช้งาน
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-status-success/15 text-status-success flex items-center justify-center">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                  </div>

                  <div className="my-space-sm flex items-baseline justify-between">
                    <div>
                      <span className="font-display-lg text-display-lg text-navy-deep font-bold tracking-tight">
                        {currFaculty.adoptionPercent}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span> +12.6%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                      <div className="bg-status-success h-full" style={{ width: currFaculty.adoptionPercent }}></div>
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>ผู้ใช้งานสม่ำเสมอ: {currFaculty.activeUsersDay} คน/วัน</span>
                      <span className="text-status-success font-semibold">บรรลุเป้าหมาย</span>
                    </div>
                  </div>
                </div>

            {/* KPI 4: Infrastructure & Uptime */}
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-navy-deep"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                    M01/M06 • ความพร้อมระบบไอที
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold mt-0.5">
                    ดัชนีความพร้อมและเสถียรภาพ
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-navy-surface/10 text-navy-deep flex items-center justify-center">
                  <span className="material-symbols-outlined">dns</span>
                </div>
              </div>

              <div className="my-space-sm flex items-baseline justify-between">
                <div>
                  <span className="font-display-lg text-display-lg text-navy-deep font-bold tracking-tight">
                    99.98%
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold">
                  SLA ผ่านเกณฑ์
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden flex">
                  <div className="bg-navy-deep h-full" style={{ width: "99.98%" }}></div>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Microservices: 6/6 Online</span>
                  <span className="text-status-success font-semibold">0 ข้อผิดพลาด</span>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

          {/* Middle Strategic Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
            {/* Left: Enrollment Trends & Student Breakdown (7 Cols) */}
            <div className="lg:col-span-7 bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    M04-F01 Breakdown
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                    สถิตินักศึกษาจำแนกตามส่วนงานวิชาการ
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-surface-container rounded-full text-xs text-on-surface-variant font-medium">
                  ภาคเรียนที่ 1/2568
                </span>
              </div>

              {/* Progress Rows */}
              <div className="space-y-space-md pt-space-xs">
                {[
                  { name: "สาขาวิทยาการคอมพิวเตอร์ (CS)", count: 1840, target: 1800, pct: 102.2, color: "bg-secondary" },
                  { name: "สาขาเทคโนโลยีสารสนเทศ (IT)", count: 1620, target: 1600, pct: 101.2, color: "bg-amber-primary" },
                  { name: "สาขาปัญญาประดิษฐ์ & ข้อมูล (AI)", count: 1380, target: 1400, pct: 98.5, color: "bg-status-success" },
                  { name: "สาขาวิศวกรรมซอฟต์แวร์ (SE)", count: 1000, target: 1000, pct: 100.0, color: "bg-navy-deep" },
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-on-surface">{row.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-navy-deep font-bold">{row.count.toLocaleString()} คน</span>
                        <span className="text-slate-400">/ เป้า {row.target.toLocaleString()}</span>
                        <span className="text-status-success font-bold">({row.pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                      <div className={`${row.color} h-full rounded-full`} style={{ width: `${Math.min(row.pct, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: e-Document Turnaround & SLA (5 Cols) */}
            <div className="lg:col-span-5 bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-amber-primary font-bold uppercase tracking-wider">
                    M04-F02 SLA Performance
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                    ความเร็วการอนุมัติคำร้องตามประเภท
                  </h3>
                </div>
              </div>

              <div className="space-y-space-sm pt-space-xs">
                {[
                  { type: "คำร้องขอหนังสือรับรอง (Status Cert)", time: "1.8 ชม.", sla: "< 4 ชม.", status: "ดีเยี่ยม" },
                  { type: "คำร้องขอลาพักการศึกษา (Leave Petition)", time: "3.4 ชม.", sla: "< 8 ชม.", status: "ดีเยี่ยม" },
                  { type: "บันทึกข้อความเสนอเซ็น (Memo)", time: "4.8 ชม.", sla: "< 12 ชม.", status: "ปกติ" },
                  { type: "หนังสือส่งภายนอก (Official Letter)", time: "6.2 ชม.", sla: "< 24 ชม.", status: "ปกติ" },
                ].map((doc, idx) => (
                  <div key={idx} className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-label-md text-label-md text-primary font-bold">{doc.type}</div>
                      <div className="text-xs text-outline">เป้าหมาย SLA: {doc.sla}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-headline-sm text-headline-sm text-status-success font-bold">{doc.time}</div>
                      <span className="px-1.5 py-0.2 rounded bg-status-success/20 text-status-success text-[10px] font-bold">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Microservices & Infrastructure Health Status Grid */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <div>
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                  Campus Cloud Architecture
                </span>
                <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                  สถานะการทำงานของบริการ Microservices &amp; Database
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-status-success font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse"></span>
                <span>All Microservices Connected (Cluster Healthy)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {servicesList.map((svc) => (
                <div key={svc.port} className="bg-surface-container-low p-space-md rounded-xl border border-border-subtle flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-success"></span>
                      <span className="font-label-md text-label-md text-navy-deep font-bold">{svc.name}</span>
                    </div>
                    <p className="text-xs text-outline mt-1">{svc.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
                      <span className="bg-surface-card px-2 py-0.5 rounded text-secondary border border-border-subtle">
                        Port {svc.port}
                      </span>
                      <span className="text-status-success font-bold">{svc.latencyMs} ms</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-bold">
                    UP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Immutable Audit Logs Table */}
          <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle overflow-hidden">
            <div className="p-space-md border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <div>
                <span className="font-label-sm text-label-sm text-amber-primary font-bold uppercase tracking-wider">
                  PDPA Section 4 &amp; ISO 27001
                </span>
                <h3 className="font-headline-sm text-headline-sm text-navy-deep font-bold">
                  บันทึกกิจกรรมความปลอดภัยและการเข้าถึงข้อมูล (Immutable Audit Trail)
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-amber-subtle text-amber-primary rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">shield</span>
                AES-256 Verified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-border-subtle">
                  <tr>
                    <th className="py-3 px-4">Audit ID</th>
                    <th className="py-3 px-4">กิจกรรม (Action)</th>
                    <th className="py-3 px-4">ทรัพยากร (Resource)</th>
                    <th className="py-3 px-4">ผู้ดำเนินการ (User)</th>
                    <th className="py-3 px-4">เวลา (Time)</th>
                    <th className="py-3 px-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {recentAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-secondary font-bold">{log.id}</td>
                      <td className="py-3 px-4 font-semibold text-navy-deep">{log.action}</td>
                      <td className="py-3 px-4 text-outline">{log.resourceType}</td>
                      <td className="py-3 px-4 font-medium text-on-surface">{log.userId}</td>
                      <td className="py-3 px-4 text-outline">{log.eventTime}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-md border-t border-navy-surface mt-auto">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-primary-fixed-dim">
          <span>College Digital Ecosystem • Executive Observability Platform (M04)</span>
          <span>&copy; 2569 ข้อมูลสารสนเทศเพื่อการตัดสินใจระดับยุทธศาสตร์</span>
        </div>
      </footer>
    </div>
  )
}
