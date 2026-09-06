'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

interface ServiceCardData {
  id: string
  code: string
  title: string
  titleEn: string
  desc: string
  icon: string
  badge: string
  badgeType: "success" | "warning" | "info" | "primary"
  category: string
  href: string
  cta: string
  ctaIcon: string
  tags: string[]
}

const servicesData: ServiceCardData[] = [
  // Category 1: SIS (M02)
  {
    id: "sis-reg",
    code: "M02-F01",
    title: "ระบบลงทะเบียนเรียนออนไลน์",
    titleEn: "Online Course Registration Portal",
    desc: "เพิ่ม-ลดรายวิชา ตรวจสอบเงื่อนไข Prerequisite เช็คที่นั่งว่างแบบ Real-time และพิมพ์ใบแจ้งยอดชำระเงินค่าธรรมเนียมการศึกษา",
    icon: "app_registration",
    badge: "เปิดให้บริการปกติ",
    badgeType: "success",
    category: "student",
    href: "/sis?tab=register",
    cta: "เข้าสู่ระบบลงทะเบียน",
    ctaIcon: "arrow_forward",
    tags: ["ลงทะเบียน", "student", "sis", "f01"],
  },
  {
    id: "sis-grades",
    code: "M02-F02/F03",
    title: "ผลการเรียน & Transcript",
    titleEn: "Grades & Academic Records",
    desc: "ตรวจสอบคะแนนรายภาค, คำนวณเกรดเฉลี่ยสะสม (GPA/GPAX), สรุปหน่วยกิตตามหลักสูตร และดาวน์โหลดใบรายงานผลการศึกษาไม่เป็นทางการ",
    icon: "grade",
    badge: "ข้อมูลอัปเดตล่าสุด",
    badgeType: "success",
    category: "student",
    href: "/sis?tab=grades",
    cta: "ตรวจสอบผลการเรียน",
    ctaIcon: "launch",
    tags: ["เกรด", "ผลการเรียน", "transcript", "student", "gpa", "sis"],
  },
  {
    id: "sis-petition",
    code: "M02-F04",
    title: "คำร้องออนไลน์นักศึกษา",
    titleEn: "Student E-Petition Gateway",
    desc: "ยื่นคำร้องขอหนังสือรับรองสถานภาพ, คำร้องขอลาพักการศึกษา, ขอเปิดรายวิชาเป็นกรณีพิเศษ พร้อมระบบแจ้งเตือนเมื่ออาจารย์อนุมัติ",
    icon: "assignment_turned_in",
    badge: "รองรับ e-Signature",
    badgeType: "warning",
    category: "student",
    href: "/sis?tab=petitions",
    cta: "ยื่นคำร้องดิจิทัล",
    ctaIcon: "post_add",
    tags: ["คำร้อง", "petition", "ลาพัก", "เอกสาร", "student", "sis"],
  },
  {
    id: "sis-schedule",
    code: "M02-F05",
    title: "ตารางเรียนและตารางสอบ",
    titleEn: "Class & Examination Schedules",
    desc: "ตรวจสอบตารางเรียนรายสัปดาห์ ห้องเรียน อาคาร เลขที่นั่งสอบกลางภาคและปลายภาค รองรับการส่งออกข้อมูลเข้าปฏิทิน",
    icon: "calendar_month",
    badge: "ซิงค์ปฏิทิน iCal",
    badgeType: "success",
    category: "student",
    href: "/sis?tab=schedule",
    cta: "ดูตารางเรียน / สอบ",
    ctaIcon: "event_available",
    tags: ["ตารางเรียน", "ตารางสอบ", "schedule", "student", "faculty", "sis"],
  },

  // Category 2: e-Document (M03)
  {
    id: "doc-inbox",
    code: "M03-F01",
    title: "ระบบสารบรรณอิเล็กทรอนิกส์",
    titleEn: "Enterprise e-Document System",
    desc: "รับ-ส่งหนังสือราชการภายในและภายนอก ออกเลขหนังสืออัตโนมัติ ติดตามสถานะหนังสือเข้า-ออก และส่งต่อหน่วยงานปลายทางอย่างปลอดภัย",
    icon: "mark_email_read",
    badge: "ระบบสารบรรณกลาง",
    badgeType: "success",
    category: "faculty",
    href: "/documents?filter=all",
    cta: "เปิดกล่องหนังสือเข้า",
    ctaIcon: "inbox",
    tags: ["สารบรรณ", "หนังสือราชการ", "doc", "edocument", "faculty", "staff"],
  },
  {
    id: "doc-approval",
    code: "M03-F02/F05",
    title: "ระบบเสนออนุมัติและลงนามดิจิทัล",
    titleEn: "Workflow Approval & e-Signature",
    desc: "แฟ้มเกษียณหนังสือเสนอผู้บริหาร รองรับการตรวจทานแก้ไข ปักหมุดหน้าเอกสาร และลงลายมือชื่อดิจิทัลที่มีผลผูกพันตามกฎหมาย",
    icon: "draw",
    badge: "มีรายการรอลงนาม",
    badgeType: "warning",
    category: "faculty",
    href: "/documents?filter=pending_sign",
    cta: "เข้าสู่แฟ้มรอลงนาม",
    ctaIcon: "edit_document",
    tags: ["ลายเซ็น", "เสนอเซ็น", "เกษียณ", "approval", "signature", "faculty", "executive"],
  },
  {
    id: "doc-archive",
    code: "M03-F06",
    title: "คลังเอกสารและสืบค้นย้อนหลัง",
    titleEn: "Archival & Full-text Search",
    desc: "ระบบสืบค้นหนังสือคำสั่ง ประกาศ ข้อบังคับวิทยาลัยแบบ Full-text Search ค้นหาตามหมวดหมู่ วันที่ และหน่วยงานเจ้าของเรื่อง",
    icon: "inventory_2",
    badge: "จัดเก็บย้อนหลัง 5 ปี",
    badgeType: "success",
    category: "faculty",
    href: "/documents?filter=signed",
    cta: "สืบค้นเอกสารวิทยาลัย",
    ctaIcon: "search",
    tags: ["ค้นหา", "เอกสาร", "คลัง", "ย้อนหลัง", "archive", "search"],
  },

  // Category 3: Executive BI (M04)
  {
    id: "exec-dashboard",
    code: "M04-F01/F03",
    title: "แดชบอร์ดภาพรวมสถาบัน",
    titleEn: "College Executive Portal",
    desc: "สรุปจำนวนนักศึกษาคงอยู่ (Headcount) แยกตามชั้นปีและหลักสูตร อัตราการสำเร็จการศึกษาตามแผน และสัดส่วนการชำระเงินค่าเล่าเรียน",
    icon: "monitoring",
    badge: "Live Data",
    badgeType: "success",
    category: "executive",
    href: "http://localhost:3001",
    cta: "เปิดแดชบอร์ดผู้บริหาร",
    ctaIcon: "open_in_new",
    tags: ["แดชบอร์ด", "สถิติ", "ผู้บริหาร", "นักศึกษา", "executive"],
  },
  {
    id: "exec-sla",
    code: "M04-F02",
    title: "สถิติคำร้องและประสิทธิภาพการให้บริการ",
    titleEn: "Petition & Process SLA",
    desc: "วิเคราะห์คอขวดขั้นตอนการอนุมัติคำร้องของแต่ละภาควิชา และรายงานระยะเวลาเฉลี่ย (Turnaround Time) ในการออกเอกสารสำคัญ",
    icon: "speed",
    badge: "รายวัน",
    badgeType: "info",
    category: "executive",
    href: "http://localhost:3001/approvals",
    cta: "รายงานสถิติละเอียด",
    ctaIcon: "query_stats",
    tags: ["สถิติ", "คำร้อง", "sla", "อนุมัติ", "executive", "analytics"],
  },

  // Category 4: Identity & Security (M01/M06)
  {
    id: "identity-sso",
    code: "M01-F01/F02",
    title: "ระบบบัญชีกลางและจัดการสิทธิ์",
    titleEn: "College SSO & RBAC",
    desc: "เปลี่ยนรหัสผ่านบัญชีมหาวิทยาลัย, เชื่อมโยงบัญชี Google Workspace / Microsoft 365 และตั้งค่าแอปพลิเคชันยืนยันตัวตน 2 ชั้น (MFA)",
    icon: "manage_accounts",
    badge: "เชื่อมต่อเสร็จสมบูรณ์",
    badgeType: "success",
    category: "infrastructure",
    href: "http://localhost:3001/users",
    cta: "จัดการบัญชีและรหัสผ่าน",
    ctaIcon: "lock_reset",
    tags: ["บัญชี", "sso", "รหัสผ่าน", "mfa", "keycloak", "security", "infrastructure"],
  },
  {
    id: "pdpa-governance",
    code: "M06-F04/F07",
    title: "ศูนย์จัดการความยินยอม PDPA & Audit Log",
    titleEn: "Data Governance Protocol",
    desc: "ตรวจสอบประวัติการร้องขอเข้าถึงข้อมูลส่วนบุคคล (PII) บันทึกกิจกรรมระบบ (System Audit Trail) และปรับแต่งความยินยอมการเปิดเผยข้อมูล",
    icon: "privacy_tip",
    badge: "บันทึกการเข้าถึง 24 ชม.",
    badgeType: "success",
    category: "infrastructure",
    href: "http://localhost:3001",
    cta: "ตรวจสอบสิทธิ PDPA และประวัติ",
    ctaIcon: "visibility",
    tags: ["pdpa", "ข้อมูลส่วนบุคคล", "consent", "log", "security", "governance"],
  },
]

export default function ServiceHubPage() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPersona, setSelectedPersona] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredServices = servicesData.filter((item) => {
    const matchesPersona = selectedPersona === "all" || item.category === selectedPersona
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesPersona && matchesSearch
  })

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* 1. Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-card/95 backdrop-blur-md shadow-[0_1px_8px_rgba(11,38,119,0.06)]">
        {/* University Sub-bar */}
        <div className="bg-primary-container text-on-primary py-space-2xs px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-container-max mx-auto flex items-center justify-between font-label-sm text-label-sm">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-space-2xs">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                ระบบบริการสารสนเทศกลาง มหาวิทยาลัย
              </span>
              <span className="hidden md:inline text-outline-variant">|</span>
              <span className="hidden md:inline text-surface-container-high">
                ปีการศึกษา 2568 (ภาคเรียนที่ 1)
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <a className="hover:text-amber-subtle transition-colors hidden sm:inline" href="#">
                ระบบเครือข่าย
              </a>
              <span className="text-primary-fixed-dim/40 hidden sm:inline">•</span>
              <a className="hover:text-amber-subtle transition-colors hidden sm:inline" href="#">
                ปฏิทินการศึกษา
              </a>
              <span className="text-primary-fixed-dim/40 hidden sm:inline">•</span>
              <a className="hover:text-amber-subtle transition-colors hidden sm:inline" href="#">
                สำนักทะเบียน
              </a>
              <div className="flex items-center bg-navy-deep px-space-xs py-0.5 rounded ml-space-xs gap-space-2xs">
                <button className="text-amber-subtle font-label-sm text-label-sm">TH</button>
                <span className="text-outline-variant">/</span>
                <button className="text-surface-container-high hover:text-on-primary font-label-sm text-label-sm">
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="h-20 max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-navy-deep text-amber-primary flex items-center justify-center font-bold text-xl shadow-md border border-navy-surface">
              <span className="material-symbols-outlined text-amber-primary text-2xl">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-tight">
                ศูนย์บริการสารสนเทศและดิจิทัล
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                Digital Service Hub · College Ecosystem
              </span>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden xl:flex items-center flex-1 max-w-md mx-space-lg">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                className="w-full bg-surface-container-low pl-10 pr-12 py-space-xs font-body-sm text-body-sm text-on-surface rounded-lg placeholder-outline focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-card transition-all"
                placeholder="ค้นหาบริการดิจิทัล, คำร้อง, แพลตฟอร์ม..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-space-sm top-1/2 -translate-y-1/2 font-label-sm text-label-sm text-outline bg-surface-card px-1.5 py-0.5 rounded shadow-xs">
                ⌘K
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-space-lg h-full">
            <Link
              href="/"
              className="py-space-md transition-colors text-secondary border-b-2 border-secondary font-label-lg"
            >
              หน้าหลักบริการ
            </Link>
            <Link
              href="/sis"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              ระบบทะเบียน SIS
            </Link>
            <Link
              href="/documents"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              งานสารบรรณ e-Doc
            </Link>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              แดชบอร์ดผู้บริหาร
            </a>
            <a
              href="#quick-support"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary py-space-md transition-colors"
            >
              ติดต่อสอบถาม / IT Helpdesk
            </a>
          </nav>

          {/* User Profile Bar */}
          <div className="flex items-center gap-space-md pl-space-xs">
            {mounted && session?.user ? (
              <div className="flex items-center gap-space-sm">
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center justify-end gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {session.user.name || session.user.username}
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-subtle text-amber-primary font-label-sm text-label-sm rounded uppercase">
                      {session.user.roles?.[0] || session.user.userType || "SSO Verified"}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="ออกจากระบบ"
                  className="w-8 h-8 rounded-full bg-blue-subtle text-navy-deep flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-high hover:bg-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-navy-deep text-surface-card font-label-md text-label-md font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>เข้าสู่ระบบ SSO</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Body Container */}
      <main className="w-full pt-28 bg-surface-canvas flex-1">
        <div className="flex flex-col w-full">
          {/* Top Quick Alert / Notice Ticker */}
          <section className="w-full bg-amber-subtle text-tertiary px-gutter-mobile lg:px-gutter-desktop py-space-xs shadow-xs border-b border-amber-200/50">
            <div className="max-w-container-max mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs font-body-sm text-body-sm">
              <div className="flex items-center gap-space-xs">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-primary text-surface-card shrink-0">
                  <span className="material-symbols-outlined text-sm">campaign</span>
                </span>
                <span className="font-label-md text-label-md text-amber-primary uppercase tracking-wide font-bold">
                  ประกาศสำคัญ:
                </span>
                <span className="font-medium text-on-surface">
                  กำหนดการยื่นคำร้องและลงทะเบียนเรียน ภาคการศึกษาที่ 1/2568 เปิดให้ดำเนินการผ่านระบบ e-Petition จนถึง 31 มี.ค. 2568
                </span>
              </div>
              <div className="flex items-center gap-space-sm pl-space-md sm:pl-0">
                <Link
                  href="/sis"
                  className="font-label-sm text-label-sm text-amber-primary hover:text-navy-deep font-semibold underline underline-offset-2 flex items-center gap-0.5"
                >
                  ยื่นคำร้องทันที
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <span className="text-outline-variant">|</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
                  SIS Gateway Active
                </span>
              </div>
            </div>
          </section>

          {/* Hero Portal Banner Section with Academic Tech Texture */}
          <section className="relative w-full bg-primary-container text-on-primary overflow-hidden shadow-md">
            {/* Ambient Geometric Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 1440 380" xmlns="http://www.w3.org/2000/svg">
                <circle cx="120" cy="80" r="140" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1.5"></circle>
                <circle cx="120" cy="80" r="260" stroke="currentColor" strokeWidth="1"></circle>
                <path d="M120 80L340 180M340 180L520 110M520 110L720 220M720 220L940 140M940 140L1120 260M1120 260L1380 180" stroke="currentColor" strokeWidth="2"></path>
                <circle cx="340" cy="180" fill="#D97706" r="6"></circle>
                <circle cx="520" cy="110" fill="#D97706" r="6"></circle>
                <circle cx="720" cy="220" fill="#FFFFFF" r="8"></circle>
                <circle cx="940" cy="140" fill="#D97706" r="6"></circle>
                <circle cx="1120" cy="260" fill="#FFFFFF" r="7"></circle>
                <polygon points="1200,40 1280,160 1360,90" stroke="currentColor" strokeWidth="1.5"></polygon>
              </svg>
            </div>

            <div className="relative max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl lg:py-space-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Left: Portal Title & Search */}
                <div className="lg:col-span-8 space-y-space-md">
                  <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs bg-navy-deep/80 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-status-success"></span>
                    <span className="font-label-sm text-label-sm text-blue-subtle font-medium">
                      College Ecosystem • Unified Campus Platform
                    </span>
                    <span className="font-label-sm text-label-sm text-outline-variant">/</span>
                    <span className="font-label-sm text-label-sm text-amber-subtle">
                      Single Sign-On (SSO) Active
                    </span>
                  </div>

                  <div className="space-y-space-xs">
                    <h1 className="font-display-lg text-display-lg lg:text-display-lg text-surface-card tracking-tight font-bold leading-tight">
                      ศูนย์บริการสารสนเทศและระบบงานดิจิทัล
                    </h1>
                    <p className="font-body-lg text-body-lg text-surface-container-high max-w-3xl leading-relaxed">
                      ระบบนิเวศดิจิทัลแบบรวมศูนย์เพื่อนักศึกษา คณาจารย์ และบุคลากรทางการศึกษา เชื่อมโยงระบบทะเบียน (SIS) 
                      สารบรรณอิเล็กทรอนิกส์ (e-Doc) และแดชบอร์ดบริหาร ภายใต้มาตรฐานความปลอดภัยระดับสถาบัน
                    </p>
                  </div>

                  {/* Quick Interactive Search Container */}
                  <div className="pt-space-xs">
                    <div className="relative bg-surface-card rounded-xl shadow-lg p-1.5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-2xl pl-3 pointer-events-none">
                        search
                      </span>
                      <input
                        aria-label="ค้นหาบริการดิจิทัล"
                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none py-2 px-1"
                        placeholder="ค้นหาบริการ เช่น ลงทะเบียน, ยื่นคำร้อง, ตรวจสอบเกรด, เสนอเซ็นเอกสาร, แดชบอร์ด..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="p-1 text-outline hover:text-on-surface"
                          title="ล้างคำค้นหา"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      )}
                      <button className="bg-primary hover:bg-navy-deep text-surface-card font-label-md text-label-md px-space-lg py-2.5 rounded-lg flex items-center gap-space-2xs transition-colors shrink-0">
                        <span className="material-symbols-outlined text-lg">travel_explore</span>
                        <span>ค้นหา</span>
                      </button>
                    </div>

                    {/* Quick Suggestions Tags */}
                    <div className="flex flex-wrap items-center gap-space-xs pt-space-sm font-label-sm text-label-sm text-surface-container-high">
                      <span className="font-medium text-amber-subtle flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">bolt</span> คำค้นหายอดนิยม:
                      </span>
                      {["ลงทะเบียน", "คำร้อง", "เกรด", "สารบรรณ", "แดชบอร์ด"].map((kw) => (
                        <button
                          key={kw}
                          onClick={() => setSearchQuery(kw)}
                          className="bg-navy-surface/60 hover:bg-navy-surface text-surface-card px-space-xs py-0.5 rounded transition-colors"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Digital Identity & Operational SLA Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-navy-surface/90 backdrop-blur-md rounded-xl p-space-lg shadow-xl text-surface-card space-y-space-md border border-navy-surface/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-amber-primary text-2xl">
                          verified_user
                        </span>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-surface-card font-semibold">
                            SSO Unified Status
                          </h3>
                          <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                            สิทธิ์การเข้าใช้งานแบบรวมศูนย์
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-status-success/20 text-status-success font-label-sm text-label-sm rounded-full font-bold">
                        ACTIVE
                      </span>
                    </div>

                    {/* Operational Metrics Cards */}
                    <div className="space-y-space-xs text-body-sm font-body-sm">
                      <div className="flex items-center justify-between bg-primary/40 p-space-xs rounded">
                        <span className="text-surface-container-high flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-blue-subtle">dns</span>
                          Core SIS 2.4 Uptime
                        </span>
                        <span className="font-label-md text-label-md text-status-success font-bold">
                          99.98%
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-primary/40 p-space-xs rounded">
                        <span className="text-surface-container-high flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-blue-subtle">
                            history_edu
                          </span>
                          e-Doc Signature SLA
                        </span>
                        <span className="font-label-md text-label-md text-surface-card font-bold">
                          &lt; 4.2 ชม. เฉลี่ย
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-primary/40 p-space-xs rounded">
                        <span className="text-surface-container-high flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-blue-subtle">lock</span>
                          ความปลอดภัยข้อมูล
                        </span>
                        <span className="font-label-md text-label-md text-amber-subtle font-bold">
                          TLS 1.3 / PDPA
                        </span>
                      </div>
                    </div>

                    <div className="pt-space-2xs">
                      <a
                        className="w-full inline-flex items-center justify-center gap-space-xs py-2 bg-amber-primary hover:bg-status-warning text-surface-card rounded-lg font-label-md text-label-md transition-colors shadow-sm"
                        href="#quick-support"
                      >
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                        <span>ขอรับความช่วยเหลือด้าน IT &amp; แจ้งปัญหา</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Persona Filter Tabs */}
          <section className="sticky top-20 z-40 bg-surface-card/95 backdrop-blur-md shadow-xs border-b border-border-subtle">
            <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between overflow-x-auto py-space-xs gap-space-xs">
                <div className="flex items-center gap-space-xs min-w-max">
                  {[
                    { id: "all", label: "บริการทั้งหมด (All Services)", icon: "apps", count: 11 },
                    { id: "student", label: "สำหรับนักศึกษา (Students - M02)", icon: "school", count: 4 },
                    { id: "faculty", label: "สำหรับอาจารย์ & บุคลากร (Faculty - M03)", icon: "badge", count: 3 },
                    { id: "executive", label: "สำหรับผู้บริหาร (Executives - M04)", icon: "analytics", count: 2 },
                    { id: "infrastructure", label: "ระบบโครงสร้าง & ข้อมูลกลาง (M01/M06)", icon: "security", count: 2 },
                  ].map((tab) => {
                    const isActive = selectedPersona === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedPersona(tab.id)}
                        className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-space-xs transition-all ${
                          isActive
                            ? "bg-primary text-on-primary shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-secondary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-label-sm font-bold ${
                            isActive
                              ? "bg-surface-card/20 text-on-primary"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Main Services Grid */}
          <div className="w-full max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className="service-card group bg-surface-card rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-border-subtle hover:border-secondary/40"
                >
                  <div
                    className={`h-1 ${
                      service.category === "student"
                        ? "bg-secondary"
                        : service.category === "faculty"
                        ? "bg-amber-primary"
                        : service.category === "executive"
                        ? "bg-navy-surface"
                        : "bg-status-info"
                    }`}
                  ></div>

                  <div className="p-space-md space-y-space-sm flex-1">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-lg bg-blue-subtle text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        {service.code}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            service.badgeType === "success"
                              ? "bg-status-success"
                              : service.badgeType === "warning"
                              ? "bg-amber-primary animate-pulse"
                              : "bg-blue-accent"
                          }`}
                        ></span>
                        <span
                          className={`font-label-sm text-label-sm font-semibold ${
                            service.badgeType === "success"
                              ? "text-status-success"
                              : service.badgeType === "warning"
                              ? "text-amber-primary"
                              : "text-blue-accent"
                          }`}
                        >
                          {service.badge}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary font-bold group-hover:text-secondary transition-colors">
                        {service.title}
                      </h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {service.titleEn}
                      </p>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <div className="p-space-md pt-0">
                    <Link
                      href={service.href}
                      className="w-full inline-flex items-center justify-center gap-space-xs py-2 px-space-sm bg-primary hover:bg-navy-deep text-surface-card rounded font-label-md text-label-md font-semibold transition-colors shadow-xs"
                    >
                      <span>{service.cta}</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        {service.ctaIcon}
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* System Health Overview Grid */}
            <section className="w-full bg-surface-card rounded-xl p-space-lg shadow-xs border border-border-subtle space-y-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    Campus Cloud &amp; Microservices
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    สถานะความพร้อมของระบบสารสนเทศส่วนกลาง
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse"></span>
                  <span className="font-label-md text-label-md text-status-success font-semibold">
                    ทุกคลัสเตอร์ทำงานสมบูรณ์ (All Systems Operational)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
                {[
                  { name: "M01 Identity Auth", status: "99.98%", sub: "Response 18ms", port: 4001 },
                  { name: "M02 SIS Database", status: "Online", sub: "PostgreSQL 16", port: 4002 },
                  { name: "M03 e-Doc Workflow", status: "Online", sub: "Digital CA Engine", port: 4003 },
                  { name: "M04 Analytics BI", status: "Synced", sub: "Metrics Engine", port: 4004 },
                  { name: "Local Disk Storage", status: "Active", sub: "SHA-256 Checksum", port: 4003 },
                  { name: "Fastify Gateway", status: "Normal", sub: "Port 4000 Proxy", port: 4000 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-low p-space-sm rounded-lg space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-status-success"></span>
                      <span className="font-label-md text-label-md text-primary font-bold">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs text-outline">{item.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Support, Manuals & Helpdesk Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-md" id="quick-support">
              <div className="bg-surface-card rounded-xl p-space-lg shadow-xs border border-border-subtle flex flex-col justify-between space-y-space-sm">
                <div className="space-y-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-blue-subtle text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">contact_support</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                    แจ้งปัญหาและ IT Helpdesk
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    พบปัญหาการเข้าใช้งานระบบ ลืมรหัสผ่าน หรือข้อขัดข้องในการลงทะเบียน สามารถเปิด Ticket เพื่อรับการแก้ไขตลอด 24 ชม.
                  </p>
                </div>
                <div className="pt-space-xs space-y-space-xs">
                  <div className="flex items-center gap-space-2xs text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-sm text-secondary">phone_in_talk</span>
                    <span>สายด่วน: 02-123-4567 ต่อ 8888</span>
                  </div>
                  <a
                    className="w-full inline-flex items-center justify-center gap-space-2xs py-2 bg-secondary hover:bg-navy-deep text-surface-card rounded font-label-md text-label-md transition-colors"
                    href="mailto:helpdesk@college.ac.th"
                  >
                    <span className="material-symbols-outlined text-sm">confirmation_number</span>
                    <span>เปิดคำร้องแจ้งปัญหา (New Ticket)</span>
                  </a>
                </div>
              </div>

              <div className="bg-surface-card rounded-xl p-space-lg shadow-xs border border-border-subtle flex flex-col justify-between space-y-space-sm">
                <div className="space-y-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-amber-subtle text-amber-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">menu_book</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                    คู่มือและแนวปฏิบัติการใช้งาน
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    ดาวน์โหลดเอกสารคู่มือ PDF และคำแนะนำขั้นตอนการลงทะเบียน คำร้องออนไลน์ และการเกษียณหนังสืออิเล็กทรอนิกส์
                  </p>
                </div>
                <div className="pt-space-xs space-y-space-2xs font-body-sm text-body-sm">
                  <a className="flex items-center justify-between text-secondary hover:text-navy-deep py-1 group" href="#">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-outline">picture_as_pdf</span>
                      คู่มือนักศึกษา: การลงทะเบียนเรียน SIS 2568
                    </span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>
                  </a>
                  <a className="flex items-center justify-between text-secondary hover:text-navy-deep py-1 group" href="#">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-outline">picture_as_pdf</span>
                      คู่มืออาจารย์: การตรวจและลงนามใน e-Doc
                    </span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">download</span>
                  </a>
                </div>
              </div>

              <div className="bg-surface-card rounded-xl p-space-lg shadow-xs border border-border-subtle flex flex-col justify-between space-y-space-sm">
                <div className="space-y-space-xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container text-navy-deep flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">security</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                    ศูนย์ความปลอดภัย PDPA &amp; พ.ร.บ.
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    ข้อมูลของท่านได้รับการคุ้มครองด้วยการเข้ารหัส AES-256-GCM ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                  </p>
                </div>
                <div className="pt-space-xs">
                  <div className="bg-surface-container-low p-space-xs rounded text-xs text-on-surface-variant space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-xs text-status-success">verified</span>
                      Data Protection Officer (DPO) Contact
                    </div>
                    <div>อีเมล: dpo@college.ac.th</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-xl border-t border-navy-surface mt-space-2xl">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-md text-xs text-primary-fixed-dim">
          <div className="flex items-center gap-space-xs">
            <span className="font-bold text-surface-card">College Digital Ecosystem</span>
            <span>•</span>
            <span>ระบบนิเวศดิจิทัลเพื่อการศึกษาและการบริการสารสนเทศแบบครบวงจร</span>
          </div>
          <div>
            &copy; 2569 สงวนลิขสิทธิ์ตาม พ.ร.บ. ข้อมูลข่าวสารและ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล
          </div>
        </div>
      </footer>
    </div>
  )
}
