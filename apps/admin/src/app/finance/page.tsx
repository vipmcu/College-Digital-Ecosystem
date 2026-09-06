'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { CampusSwitcher } from '../../components/campus-switcher'

interface BudgetItem {
  departmentCode: string
  name: string
  allocated: number
  disbursed: number
  obligated: number
  remaining: number
  ratePercent: number
}

interface LedgerItem {
  id: string
  entryNumber: string
  date: string
  description: string
  type: 'DEBIT' | 'CREDIT'
  category: string
  amount: number
  refDoc: string
  status: 'POSTED' | 'RECONCILED'
}

interface ReconciliationItem {
  id: string
  receiptNo: string
  studentCode: string
  studentName: string
  amount: number
  channel: string
  paidAt: string
  bankTxRef: string
  reconciled: boolean
}

const initialBudgets: BudgetItem[] = [
  { departmentCode: "FAC-ENG", name: "คณะวิศวกรรมศาสตร์", allocated: 52000000, disbursed: 38200000, obligated: 4500000, remaining: 9300000, ratePercent: 73.4 },
  { departmentCode: "FAC-SCI", name: "คณะวิทยาศาสตร์และเทคโนโลยี", allocated: 46000000, disbursed: 34500000, obligated: 3200000, remaining: 8300000, ratePercent: 75.0 },
  { departmentCode: "FAC-BUS", name: "คณะบริหารธุรกิจและศิลปศาสตร์", allocated: 38000000, disbursed: 26800000, obligated: 2100000, remaining: 9100000, ratePercent: 70.5 },
  { departmentCode: "FAC-IND", name: "คณะครุศาสตร์อุตสาหกรรม", allocated: 28000000, disbursed: 19400000, obligated: 1800000, remaining: 6800000, ratePercent: 69.2 },
  { departmentCode: "DIV-IT", name: "สำนักวิทยบริการและเทคโนโลยีสารสนเทศ", allocated: 21400000, disbursed: 13750000, obligated: 3500000, remaining: 4150000, ratePercent: 64.2 },
]

const initialLedger: LedgerItem[] = [
  { id: "GL-8911", entryNumber: "JV-680901-01", date: "01 ก.ย. 2568 09:15", description: "รับชำระค่าธรรมเนียมการศึกษา ภาคเรียน 1/2568 (PromptPay Batch 1)", type: "CREDIT", category: "ค่าเล่าเรียน", amount: 14250000, refDoc: "SIS-REC-BATCH-01", status: "RECONCILED" },
  { id: "GL-8912", entryNumber: "PV-680902-04", date: "02 ก.ย. 2568 11:30", description: "เบิกจ่ายค่าบำรุงรักษา Cloud Server และ Local Storage สำหรับ e-Document", type: "DEBIT", category: "เทคโนโลยีสารสนเทศ", amount: 480000, refDoc: "DOC-MEMO-2568-089", status: "POSTED" },
  { id: "GL-8913", entryNumber: "PV-680903-08", date: "03 ก.ย. 2568 14:00", description: "จ่ายเงินอุดหนุนโครงการวิจัยและนวัตกรรม AI งวดที่ 1 (วช./NRCT)", type: "DEBIT", category: "เงินอุดหนุนวิจัย", amount: 1200000, refDoc: "RES-GRANT-NRCT-01", status: "POSTED" },
  { id: "GL-8914", entryNumber: "JV-680904-02", date: "04 ก.ย. 2568 16:45", description: "รับเงินจัดสรรงบประมาณแผ่นดินไตรมาสที่ 4/2568", type: "CREDIT", category: "งบประมาณแผ่นดิน", amount: 45000000, refDoc: "MOF-ALLOC-Q4", status: "RECONCILED" },
  { id: "GL-8915", entryNumber: "PV-680905-12", date: "05 ก.ย. 2568 10:20", description: "จัดซื้อครุภัณฑ์เครื่องแม่ข่ายและอุปกรณ์กระจายสัญญาณความเร็วสูง", type: "DEBIT", category: "ครุภัณฑ์คอมพิวเตอร์", amount: 2850000, refDoc: "PROC-PO-68-042", status: "POSTED" },
]

const initialRecon: ReconciliationItem[] = [
  { id: "REC-1", receiptNo: "RC-6801-0001", studentCode: "66010042", studentName: "นายวีรภัทร ชาญวณิชย์", amount: 18500, channel: "PromptPay QR", paidAt: "01 ก.ย. 2568 10:14", bankTxRef: "TXN-BBL-88912", reconciled: true },
  { id: "REC-2", receiptNo: "RC-6801-0002", studentCode: "66010088", studentName: "นางสาวศิริพร บุญมั่น", amount: 16500, channel: "PromptPay QR", paidAt: "01 ก.ย. 2568 11:22", bankTxRef: "TXN-KTB-44120", reconciled: true },
  { id: "REC-3", receiptNo: "RC-6801-0003", studentCode: "65020119", studentName: "นายชวลิต วัฒนา", amount: 22000, channel: "Bill Payment", paidAt: "02 ก.ย. 2568 14:05", bankTxRef: "TXN-SCB-91023", reconciled: true },
  { id: "REC-4", receiptNo: "RC-6801-0004", studentCode: "67030012", studentName: "นางสาวมลธิรา เกิดสุข", amount: 18500, channel: "PromptPay QR", paidAt: "03 ก.ย. 2568 09:30", bankTxRef: "TXN-KBANK-55129", reconciled: true },
]

export default function FinanceErpPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"budget" | "ledger" | "reconciliation">("budget")
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  const handleExportLedger = () => {
    setExportNotice("กำลังส่งออกไฟล์บัญชีแยกประเภท general_ledger_2568.csv...")
    const headers = ["Entry Number", "Date", "Description", "Type", "Category", "Amount (THB)", "Reference Doc", "Status"]
    const rows = initialLedger.map(l => [l.entryNumber, l.date, `"${l.description}"`, l.type, `"${l.category}"`, l.amount, l.refDoc, l.status])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `general_ledger_report_2568.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setTimeout(() => {
      setExportNotice("ส่งออกไฟล์รายงานบัญชีแยกประเภท (General Ledger) สำเร็จ")
      setTimeout(() => setExportNotice(null), 4000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-navy-deep flex items-center justify-center text-amber-subtle font-extrabold text-sm shadow-md">
                CD
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface leading-tight">
                  ERP Finance &amp; Budgeting
                </span>
                <span className="text-[11px] text-slate-500">
                  ระบบบริหารการเงิน บัญชีแยกประเภท และงบประมาณ
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 h-full text-xs font-semibold">
            <Link href="/" className="text-slate-600 hover:text-secondary transition-colors">
              แดชบอร์ดผู้บริหาร
            </Link>
            <Link href="/users" className="text-slate-600 hover:text-secondary transition-colors">
              จัดการผู้ใช้งาน &amp; PDPA
            </Link>
            <Link href="/approvals" className="text-slate-600 hover:text-secondary transition-colors">
              คิวอนุมัติคำร้อง
            </Link>
            <Link href="/finance" className="text-secondary border-b-2 border-secondary py-5 font-bold">
              การเงินและงบประมาณ ERP
            </Link>
            <Link href="/ai-analytics" className="text-slate-600 hover:text-secondary transition-colors">
              AI/ML Analytics
            </Link>
            <Link href="/integration" className="text-slate-600 hover:text-secondary transition-colors">
              เชื่อมโยง สกอ./สมศ.
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <CampusSwitcher />
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="ออกจากระบบ"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-md mb-3">
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>Enterprise Resource Planning — Finance &amp; Budget Module</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                ระบบบัญชีการเงินและการบริหารงบประมาณสถาบัน
              </h2>
              <p className="text-indigo-100 text-sm max-w-2xl">
                ติดตามการเบิกจ่ายงบประมาณแผ่นดินและเงินรายได้, ตรวจสอบสมุดบัญชีแยกประเภท (General Ledger), และกระทบยอดการรับชำระค่าธรรมเนียมการศึกษาแบบ Real-time
              </p>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={handleExportLedger}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-2 border border-white/20"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>ส่งออกรายงาน GL (CSV)</span>
              </button>
            </div>
          </div>
        </div>

        {exportNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span>{exportNotice}</span>
          </div>
        )}

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">งบประมาณจัดสรรรวม</span>
              <span className="material-symbols-outlined text-indigo-600">account_balance_wallet</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">฿185,400,000</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">ปีงบประมาณ 2568</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">เบิกจ่ายแล้วสะสม</span>
              <span className="material-symbols-outlined text-blue-600">payments</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">฿132,650,000</span>
            <span className="text-[11px] text-blue-600 font-semibold block mt-1">อัตราเบิกจ่าย 71.55%</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">รายรับค่าธรรมเนียมการศึกษา</span>
              <span className="material-symbols-outlined text-emerald-600">receipt_long</span>
            </div>
            <span className="text-2xl font-extrabold text-emerald-700 block">฿48,200,000</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">กระทบยอดสำเร็จ 100%</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">งบประมาณคงเหลือ</span>
              <span className="material-symbols-outlined text-amber-600">savings</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">฿52,750,000</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-1">พร้อมจัดสรรไตรมาส 4</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("budget")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "budget"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">pie_chart</span>
            <span>จัดสรรงบประมาณรายคณะ ({initialBudgets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "ledger"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            <span>บัญชีแยกประเภท (General Ledger) ({initialLedger.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "reconciliation"
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>กระทบยอดเงินรับค่าเทอม ({initialRecon.length})</span>
          </button>
        </div>

        {/* Tab 1: Budget Allocation */}
        {activeTab === "budget" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">แผนจัดสรรและการใช้จ่ายงบประมาณจำแนกตามหน่วยงาน</h3>
                <p className="text-xs text-slate-500">ปีงบประมาณ พ.ศ. 2568 (ตุลาคม 2567 – กันยายน 2568)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                เป้าหมายการเบิกจ่าย &ge; 70%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">รหัสหน่วยงาน / คณะ</th>
                    <th className="p-4 text-right">งบประมาณจัดสรร</th>
                    <th className="p-4 text-right">เบิกจ่ายแล้ว</th>
                    <th className="p-4 text-right">ผูกพันงบประมาณ</th>
                    <th className="p-4 text-right">คงเหลือสุทธิ</th>
                    <th className="p-4 text-center">อัตราการใช้จ่าย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialBudgets.map((b) => (
                    <tr key={b.departmentCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                            {b.departmentCode}
                          </span>
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-800">฿{b.allocated.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-emerald-700">฿{b.disbursed.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-amber-700">฿{b.obligated.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-slate-900">฿{b.remaining.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${b.ratePercent}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 w-10 text-right">{b.ratePercent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: General Ledger */}
        {activeTab === "ledger" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-900">สมุดรายวันทั่วไป (General Ledger Journal)</h3>
                <p className="text-xs text-slate-500">บันทึกรายการบัญชีเดบิต/เครดิต พร้อมเอกสารอ้างอิงและ Audit Trail</p>
              </div>
              <button
                onClick={handleExportLedger}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">เลขที่ใบสำคัญ</th>
                    <th className="p-4">วัน-เวลา</th>
                    <th className="p-4">คำอธิบายรายการ</th>
                    <th className="p-4">หมวดหมู่</th>
                    <th className="p-4">ประเภท</th>
                    <th className="p-4 text-right">จำนวนเงิน (บาท)</th>
                    <th className="p-4 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialLedger.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{item.entryNumber}</td>
                      <td className="p-4 text-slate-500">{item.date}</td>
                      <td className="p-4 font-medium text-slate-800 max-w-xs">{item.description}</td>
                      <td className="p-4 text-slate-600">{item.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900">
                        {item.type === 'CREDIT' ? '+' : '-'}฿{item.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Reconciliation */}
        {activeTab === "reconciliation" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">รายงานการตรวจสอบและกระทบยอดเงินค่าเทอม (Payment Reconciliation)</h3>
              <p className="text-xs text-slate-500">เปรียบเทียบข้อมูลการชำระเงินในระบบทะเบียน SIS กับ Statement ธนาคาร</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">เลขที่ใบเสร็จ</th>
                    <th className="p-4">รหัสนักศึกษา</th>
                    <th className="p-4">ชื่อ-สกุล นักศึกษา</th>
                    <th className="p-4">ช่องทางชำระเงิน</th>
                    <th className="p-4">วัน-เวลา ชำระ</th>
                    <th className="p-4 text-right">ยอดชำระ</th>
                    <th className="p-4 text-center">สถานะกระทบยอด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialRecon.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{r.receiptNo}</td>
                      <td className="p-4 font-mono text-slate-600">{r.studentCode}</td>
                      <td className="p-4 font-medium text-slate-800">{r.studentName}</td>
                      <td className="p-4 text-slate-600">{r.channel}</td>
                      <td className="p-4 text-slate-500">{r.paidAt}</td>
                      <td className="p-4 text-right font-bold text-slate-900">฿{r.amount.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          <span>Reconciled</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
