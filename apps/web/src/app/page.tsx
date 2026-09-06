'use client'

import React from "react"
import Link from "next/link"
import { formatThaiDate } from "@repo/utils"
import { AuthStatus } from "../components/AuthStatus"
import {
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  ExternalLink,
  CheckCircle2,
  Lock
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top Quick Alert / Notice Ticker from Stitch Design */}
      <section className="w-full bg-amber-subtle text-on-surface px-4 lg:px-6 py-2 border-b border-amber-200/60 shadow-xs">
        <div className="max-w-container-max mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-primary text-white shrink-0">
              <Sparkles size={12} />
            </span>
            <span className="font-bold text-amber-800 uppercase tracking-wide">ประกาศสำคัญ:</span>
            <span className="font-medium text-slate-700">
              กำหนดการยื่นคำร้องและลงทะเบียนเรียน ภาคการศึกษาที่ 1/2568 เปิดให้ดำเนินการผ่านระบบแล้ว
            </span>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              ระบบให้บริการปกติ
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-container-max mx-auto w-full px-4 lg:px-6 py-8 flex-1">
        {/* Header */}
        <header className="border-b border-border-subtle pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-navy-deep text-blue-accent flex items-center justify-center shadow-md">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-navy-deep tracking-tight">
                วิทยาลัยดิจิทัล (College Digital Ecosystem)
              </h1>
              <p className="text-sm text-slate-500">
                ระบบบริการการศึกษาและสารบรรณคำร้องอิเล็กทรอนิกส์สำหรับนักศึกษาและคณาจารย์
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
            <AuthStatus />
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} />
              <span>{formatThaiDate()}</span>
            </div>
          </div>
        </header>

        {/* Hero Banner with Academic Color Palette */}
        <section className="relative rounded-2xl bg-gradient-to-r from-navy-deep to-navy-surface text-white p-6 md:p-8 mb-8 shadow-lg overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
              <ShieldCheck size={14} /> มาตรฐานความปลอดภัย PDPA & Single Sign-On
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
              ศูนย์รวมบริการดิจิทัลวิทยาลัยครบวงจร
            </h2>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-6">
              เชื่อมโยงข้อมูลนักศึกษา หลักสูตร ตารางเรียน ผลการเรียน และระบบงานสารบรรณอิเล็กทรอนิกส์ไว้ในแพลตฟอร์มเดียว พร้อมความถูกต้องตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
            <GraduationCap size={280} />
          </div>
        </section>

        {/* Main Portals Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* SIS Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-subtle text-navy-surface flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-deep">
                    ระบบบริการการศึกษา (SIS Online)
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Core Student Information System (M02)</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                ลงทะเบียนรายวิชา ตรวจสอบตารางเรียน/ตารางสอบ ดูผลการเรียนสะสม (Online Unofficial Transcript) และเกรดเฉลี่ยสะสม (GPA)
              </p>

              <ul className="space-y-2 mb-6 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-status-success shrink-0" />
                  <span>เปิดลงทะเบียนเรียนภาคการศึกษา 1/2568 ด้วยระบบ Seat Locking ป้องกันที่นั่งเกิน</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award size={14} className="text-amber-primary shrink-0" />
                  <span>ตรวจสอบหน่วยกิตสะสมและเงื่อนไขการสำเร็จการศึกษา</span>
                </li>
              </ul>
            </div>

            <Link
              href="/sis"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-navy-deep hover:bg-navy-surface text-white rounded-lg font-semibold text-sm transition-colors shadow-xs"
            >
              <span>เข้าสู่ระบบ SIS</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* e-Document Card */}
          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-subtle text-amber-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-deep">
                    ระบบสารบรรณ & คำร้องออนไลน์
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">e-Document & Approval Workflow (M03)</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                ยื่นคำร้องขอลาพักการเรียน ขอเอกสารรับรอง ติดตามสถานะการอนุมัติแบบเรียลไทม์ และระบบลงนามดิจิทัลที่ตรวจสอบได้
              </p>

              <ul className="space-y-2 mb-6 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-accent shrink-0" />
                  <span>ลดระยะเวลาการอนุมัติเอกสารมากกว่า 50% ด้วย Multi-step Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-status-success shrink-0" />
                  <span>ลายเซ็นดิจิทัลพร้อมตรวจสอบความถูกต้องด้วย SHA-256 Checksum</span>
                </li>
              </ul>
            </div>

            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-navy-deep text-navy-deep hover:bg-blue-subtle/50 rounded-lg font-semibold text-sm transition-colors shadow-xs"
            >
              <span>ยื่นและติดตามคำร้อง</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Quick Links Footer Card */}
        <section className="bg-surface-container-low border border-border-subtle rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-deep/10 text-navy-deep flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-deep">สำหรับผู้บริหารและเจ้าหน้าที่ (Admin Console)</h4>
              <p className="text-xs text-slate-500">จัดการข้อมูลผู้ใช้ อนุมัติคำร้อง และดูแดชบอร์ดสถิติผู้บริหาร (Executive KPIs)</p>
            </div>
          </div>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            <span>เปิด Admin Console (:3001)</span>
            <ExternalLink size={13} />
          </a>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-border-subtle py-4 px-4 text-center text-xs text-slate-400 bg-white">
        วิทยาลัยดิจิทัล (College Digital Ecosystem MVP) &copy; 2568 — ระบบได้รับการคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. PDPA พ.ศ. 2562
      </footer>
    </div>
  )
}
