'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { CampusSwitcher } from '../../components/campus-switcher'

interface EndpointItem {
  name: string
  endpoint: string
  method: 'POST' | 'PUT' | 'GET'
  destination: string
  status: 'CONNECTED' | 'SYNCING' | 'OFFLINE'
  lastSync: string
  recordsCount: number
}

interface SarIndicatorItem {
  code: string
  title: string
  category: string
  targetScore: number
  actualScore: number
  status: 'EXCEEDED' | 'MET' | 'NEEDS_IMPROVEMENT'
  lastVerified: string
}

const initialEndpoints: EndpointItem[] = [
  { name: "ข้อมูลสถิตินักศึกษาคงอยู่และผู้สำเร็จการศึกษา", endpoint: "/api/v1/mhesi/students/sync", method: "POST", destination: "ศูนย์ข้อมูลกระทรวง อว. (สกอ.)", status: "CONNECTED", lastSync: "วันนี้ 10:00 น.", recordsCount: 4820 },
  { name: "ข้อมูลหลักสูตรและรายวิชาที่ผ่านการรับรอง", endpoint: "/api/v1/mhesi/curriculum/sync", method: "POST", destination: "ระบบ CHEQA ฐานข้อมูลหลักสูตร", status: "CONNECTED", lastSync: "04 ก.ย. 2568", recordsCount: 24 },
  { name: "ข้อมูลคุณวุฒิและภาระงานสอนคณาจารย์", endpoint: "/api/v1/mhesi/faculty/sync", method: "POST", destination: "ระบบข้อมูลบุคลากร อว.", status: "CONNECTED", lastSync: "01 ก.ย. 2568", recordsCount: 340 },
  { name: "รายงานการประเมินคุณภาพการศึกษาภายนอก", endpoint: "/api/v1/onesqa/sar/submission", method: "POST", destination: "ระบบสารสนเทศ สมศ. (ONESQA Net)", status: "CONNECTED", lastSync: "15 ส.ค. 2568", recordsCount: 1 },
]

const initialSarIndicators: SarIndicatorItem[] = [
  { code: "IND-1.1", title: "การบริหารจัดการและพัฒนาหลักสูตรตามกรอบ TQF", category: "ด้านหลักสูตรและการเรียนการสอน", targetScore: 4.5, actualScore: 4.8, status: "EXCEEDED", lastVerified: "2568-08-30" },
  { code: "IND-2.1", title: "สัดส่วนอาจารย์ประจำที่มีตำแหน่งทางวิชาการ (ผศ./รศ./ศ.)", category: "ด้านคณาจารย์และบุคลากร", targetScore: 4.0, actualScore: 4.2, status: "MET", lastVerified: "2568-08-30" },
  { code: "IND-3.2", title: "อัตราการได้งานทำของบัณฑิตภายใน 1 ปีหลังสำเร็จการศึกษา", category: "ด้านคุณภาพผู้เรียนและบัณฑิต", targetScore: 85.0, actualScore: 92.5, status: "EXCEEDED", lastVerified: "2568-08-30" },
  { code: "IND-4.1", title: "ผลงานวิจัยและนวัตกรรมที่ได้รับการตีพิมพ์ Scopus / TCI", category: "ด้านการวิจัยและนวัตกรรม", targetScore: 30.0, actualScore: 42.0, status: "EXCEEDED", lastVerified: "2568-08-30" },
  { code: "IND-5.1", title: "ระบบธรรมาภิบาลและการคุ้มครองข้อมูลส่วนบุคคล (PDPA)", category: "ด้านการบริหารจัดการและเทคโนโลยี", targetScore: 100.0, actualScore: 100.0, status: "MET", lastVerified: "2568-08-30" },
]

export default function ExternalIntegrationPage() {
  const [activeTab, setActiveTab] = useState<"che" | "onesqa" | "logs">("che")
  const [endpoints, setEndpoints] = useState<EndpointItem[]>(initialEndpoints)
  const [syncingEndpoint, setSyncingEndpoint] = useState<string | null>(null)
  const [syncNotice, setSyncNotice] = useState<string | null>(null)
  const [showPayloadModal, setShowPayloadModal] = useState<boolean>(false)

  const handleTriggerSync = (name: string) => {
    setSyncingEndpoint(name)
    setTimeout(() => {
      setSyncingEndpoint(null)
      setSyncNotice(`ซิงก์ข้อมูล "${name}" ไปยังศูนย์ข้อมูลกลาง สกอ./อว. สำเร็จ (Response: 200 OK)`)
      setTimeout(() => setSyncNotice(null), 4000)
    }, 1500)
  }

  const handleExportSar = () => {
    alert("กำลังสร้างและส่งออกรายงานการประเมินตนเอง (ONESQA SAR Report) ในรูปแบบ PDF และ XML Schema...")
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                QA
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface leading-tight">
                  CHE / ONESQA Real-time Data Bridge
                </span>
                <span className="text-[11px] text-slate-500">
                  ระบบเชื่อมต่อข้อมูลมาตรฐานกระทรวง อว. (สกอ.) และ สมศ.
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
            <Link href="/finance" className="text-slate-600 hover:text-secondary transition-colors">
              การเงินและงบประมาณ ERP
            </Link>
            <Link href="/ai-analytics" className="text-slate-600 hover:text-secondary transition-colors">
              AI/ML Analytics
            </Link>
            <Link href="/integration" className="text-secondary border-b-2 border-secondary py-5 font-bold">
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
        <div className="bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-medium backdrop-blur-md mb-3">
              <span className="material-symbols-outlined text-sm">hub</span>
              <span>MHESI / CHEQA &amp; ONESQA Quality Assurance Data Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              ศูนย์เชื่อมโยงข้อมูลมาตรฐานอุดมศึกษาและการประกันคุณภาพภายนอก
            </h2>
            <p className="text-cyan-100 text-sm leading-relaxed">
              แลกเปลี่ยนข้อมูลแบบ Machine-to-Machine (M2M) ร่วมกับศูนย์ข้อมูลกระทรวงการอุดมศึกษาฯ (อว.), ประเมินผลดัชนีคุณภาพ SAR อัตโนมัติสำหรับ สมศ. และตรวจสอบความถูกต้องตามเกณฑ์มาตรฐาน TQF
            </p>
          </div>
        </div>

        {syncNotice && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 flex items-center gap-3 text-xs font-semibold animate-fade-in shadow-sm">
            <span className="material-symbols-outlined text-cyan-600">verified</span>
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("che")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "che"
                ? "bg-cyan-700 text-white shadow-md shadow-cyan-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">cloud_sync</span>
            <span>API Gateway สกอ./กระทรวง อว. ({endpoints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("onesqa")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "onesqa"
                ? "bg-cyan-700 text-white shadow-md shadow-cyan-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">fact_check</span>
            <span>ตัวบ่งชี้การประกันคุณภาพ สมศ. (SAR) ({initialSarIndicators.length})</span>
          </button>
        </div>

        {/* Tab 1: CHE Endpoints */}
        {activeTab === "che" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">ช่องทางส่งผ่านข้อมูลอัตโนมัติ (M2M Data Pipelines)</h3>
                <p className="text-xs text-slate-500">เข้ารหัสด้วย TLS 1.3 พร้อม mTLS Certificate ประจำสถาบัน</p>
              </div>
              <button
                onClick={() => setShowPayloadModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">code</span>
                <span>ดูตัวอย่าง JSON Schema</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {endpoints.map((ep, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-100">
                      {ep.method}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-800">{ep.endpoint}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ep.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{ep.name}</h4>
                      <p className="text-xs text-slate-500">ปลายทาง: {ep.destination} • ซิงก์ล่าสุด: {ep.lastSync}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">จำนวน Record ที่ซิงก์</span>
                      <span className="text-sm font-extrabold text-slate-900">{ep.recordsCount.toLocaleString()} รายการ</span>
                    </div>
                    <button
                      onClick={() => handleTriggerSync(ep.name)}
                      disabled={syncingEndpoint === ep.name}
                      className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span className={`material-symbols-outlined text-sm ${syncingEndpoint === ep.name ? 'animate-spin' : ''}`}>
                        sync
                      </span>
                      <span>{syncingEndpoint === ep.name ? 'กำลังซิงก์...' : 'ซิงก์ข้อมูลทันที'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: ONESQA SAR */}
        {activeTab === "onesqa" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">สรุปคะแนนรายงานการประเมินตนเองของสถานศึกษา (SAR Auto-Assessment)</h3>
                <p className="text-xs text-slate-500">ประมวลผลข้อมูลจากฐานข้อมูล SIS, วิจัย, และระบบบริหารจัดการแบบอัตโนมัติ</p>
              </div>
              <button
                onClick={handleExportSar}
                className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>สร้างรายงาน SAR สถาบัน</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">รหัสตัวบ่งชี้</th>
                    <th className="p-4">ชื่อตัวบ่งชี้คุณภาพ</th>
                    <th className="p-4">หมวดหมู่</th>
                    <th className="p-4 text-center">ค่าเป้าหมาย</th>
                    <th className="p-4 text-center">ผลลัพธ์จริง</th>
                    <th className="p-4 text-center">สถานะการประเมิน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialSarIndicators.map((ind) => (
                    <tr key={ind.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{ind.code}</td>
                      <td className="p-4 font-bold text-slate-800">{ind.title}</td>
                      <td className="p-4 text-slate-500">{ind.category}</td>
                      <td className="p-4 text-center font-semibold text-slate-600">{ind.targetScore}</td>
                      <td className="p-4 text-center font-extrabold text-cyan-800 text-sm">{ind.actualScore}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          ind.status === 'EXCEEDED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {ind.status === 'EXCEEDED' ? 'เกินเป้าหมาย' : 'บรรลุเป้าหมาย'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: JSON Schema Preview */}
        {showPayloadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">ตัวอย่างโครงสร้าง JSON Payload (มาตรฐานกระทรวง อว.)</h3>
                <button
                  onClick={() => setShowPayloadModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-80 mb-4">
                <pre>{`{
  "institutionCode": "COLL-6801",
  "academicYear": 2568,
  "semester": 1,
  "syncTimestamp": "${new Date().toISOString()}",
  "checksumSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "headcount": {
    "totalActiveStudents": 4820,
    "facultyBreakdown": [
      { "facultyCode": "FAC-ENG", "count": 1420 },
      { "facultyCode": "FAC-SCI", "count": 1680 },
      { "facultyCode": "FAC-BUS", "count": 1720 }
    ]
  },
  "securityAudit": {
    "pdpaCompliant": true,
    "mfaEnforced": true
  }
}`}</pre>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowPayloadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
