'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { CampusSwitcher } from '../../components/campus-switcher'

interface DropoutStudentItem {
  id: string
  code: string
  name: string
  faculty: string
  yearLevel: number
  gpa: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number
  factors: string[]
  intervention: string
}

const initialDropoutRisks: DropoutStudentItem[] = [
  { id: "s1", code: "66010092", name: "นายธนพล สุขสันต์", faculty: "คณะวิทยาศาสตร์", yearLevel: 2, gpa: 1.88, riskLevel: "CRITICAL", riskScore: 88, factors: ["GPA ต่ำกว่า 2.00 ติดต่อกัน 2 ภาค", "ขาดเรียนวิชาแล็บเกิน 3 ครั้ง", "ยังไม่ได้ชำระค่าเทอมงวด 2"], intervention: "นัดพบอาจารย์ที่ปรึกษาด่วนและส่งต่อกองทุนกู้ยืม กยศ." },
  { id: "s2", code: "67020015", name: "นางสาวชุติมา แสงจันทร์", faculty: "คณะวิศวกรรมศาสตร์", yearLevel: 1, gpa: 2.12, riskLevel: "HIGH", riskScore: 74, factors: ["ขาดส่งการบ้าน LMS 3 รายการ", "ผลคะแนนสอบกลางภาค Calculus ต่ำกว่าเกณฑ์"], intervention: "จัดติวเสริมรายวิชาพื้นฐานและประสานงานรุ่นพี่ Mentor" },
  { id: "s3", code: "65030140", name: "นายกิตติคุณ รัตนธรรม", faculty: "คณะบริหารธุรกิจ", yearLevel: 3, gpa: 2.45, riskLevel: "MEDIUM", riskScore: 48, factors: ["ถอนรายวิชา (W) 2 ตัวในภาคเรียนก่อน"], intervention: "ติดตามแผนการลงทะเบียนเรียนเพื่อจบตามหลักสูตร" },
  { id: "s4", code: "66010042", name: "นายวีรภัทร ชาญวณิชย์", faculty: "คณะวิทยาศาสตร์", yearLevel: 3, gpa: 3.82, riskLevel: "LOW", riskScore: 8, factors: ["ผลการเรียนเกียรตินิยม", "ส่งงานครบทุกครั้ง"], intervention: "ไม่มีความเสี่ยง ส่งเสริมการขอทุนวิจัยระดับปริญญาตรี" },
]

export default function AiAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"dropout" | "recommendation" | "copilot">("dropout")
  const [studentList, setStudentList] = useState<DropoutStudentItem[]>(initialDropoutRisks)
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("ALL")
  const [notifiedStudents, setNotifiedStudents] = useState<Record<string, boolean>>({})
  
  // AI Copilot State
  const [chatPrompt, setChatPrompt] = useState<string>("")
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; metrics?: Record<string, string> }>>([
    {
      role: 'assistant',
      content: 'สวัสดีครับท่านผู้บริหาร ผมคือ College AI Executive Copilot พร้อมวิเคราะห์ข้อมูลเชิงยุทธศาสตร์, คาดการณ์แนวโน้มนักศึกษา, และวิเคราะห์งบประมาณ คุณสามารถพิมพ์คำถามหรือเลือกหัวข้อยอดนิยมด้านล่างได้เลยครับ',
    },
  ])
  const [isThinking, setIsThinking] = useState<boolean>(false)

  const handleNotifyAdvisor = (studentId: string, studentName: string) => {
    setNotifiedStudents(prev => ({ ...prev, [studentId]: true }))
    alert(`ส่งการแจ้งเตือนด่วนไปยังอาจารย์ที่ปรึกษาของ "${studentName}" เรียบร้อยแล้ว`)
  }

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return
    const userMsg = { role: 'user' as const, content: promptText }
    setChatMessages(prev => [...prev, userMsg])
    setChatPrompt("")
    setIsThinking(true)

    setTimeout(() => {
      let reply = ""
      let metricsData: Record<string, string> | undefined = undefined

      if (promptText.includes("ตกออก") || promptText.includes("เสี่ยง")) {
        reply = "จากการประเมินด้วย AI Predictive Model พบว่ามีนักศึกษาที่มีความเสี่ยงสูงถึงวิกฤต (Critical/High) รวม 35 คน จากทั้งหมด 4,820 คน (0.72%) โดยกลุ่มเสี่ยงหลักคือนักศึกษาชั้นปีที่ 1 และ 2 ของคณะวิทยาศาสตร์และวิศวกรรมศาสตร์ ปัจจัยหลักเกิดจากผลคะแนนสอบกลางภาควิชาพื้นฐานคำนวณและปัญหาภาระค่าครองชีพ แนะนำให้เปิดโครงการ Clinic ติวเสริมร่วมกับอาจารย์ประจำวิชาครับ"
        metricsData = { "นักศึกษากลุ่มเสี่ยงวิกฤต": "12 คน", "กลุ่มเสี่ยงสูง": "23 คน", "อัตราความแม่นยำโมเดล": "92.4%", "AUC-ROC Score": "0.89" }
      } else if (promptText.includes("งบประมาณ") || promptText.includes("เบิกจ่าย")) {
        reply = "งบประมาณประจำปี 2568 วงเงินรวม 185.4 ล้านบาท มีการเบิกจ่ายแล้ว 132.65 ล้านบาท (71.55%) ซึ่งเป็นไปตามเป้าหมายของกรมบัญชีกลาง อย่างไรก็ตาม สำนักวิทยบริการฯ มีอัตราเบิกจ่ายอยู่ที่ 64.2% ซึ่งต่ำกว่าเป้าหมายเฉลี่ย แนะนำให้เร่งรัดการตรวจรับครุภัณฑ์ระบบแม่ข่ายภายในสัปดาห์นี้ครับ"
        metricsData = { "เบิกจ่ายรวม": "71.55%", "เป้าหมายขั้นต่ำ": "70.00%", "งบประมาณคงเหลือ": "52.75 ล้านบาท" }
      } else {
        reply = `ระบบได้ประมวลผลข้อมูลเชิงยุทธศาสตร์สำหรับหัวข้อ "${promptText}" เรียบร้อยแล้ว ภาพรวมสถาบันมีอัตราความคงอยู่ (Retention Rate) 96.8% และระยะเวลาอนุมัติคำร้องเฉลี่ย 2.1 วัน ระบบพร้อมส่งออกข้อมูลละเอียดเข้าสู่รายงาน สกอ./สมศ.`
        metricsData = { "System Adoption": "88.5%", "SLA Turnaround": "2.1 วัน", "Data Freshness": "Live (Real-time)" }
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply, metrics: metricsData }])
      setIsThinking(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                AI
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface leading-tight">
                  Advanced AI/ML Intelligence Center
                </span>
                <span className="text-[11px] text-slate-500">
                  ระบบปัญญาประดิษฐ์ทำนายความเสี่ยงและ AI Executive Copilot
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
            <Link href="/ai-analytics" className="text-secondary border-b-2 border-secondary py-5 font-bold">
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
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-medium backdrop-blur-md mb-3">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span>Machine Learning &amp; Predictive Analytics Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              ศูนย์ปัญญาประดิษฐ์เพื่อการบริหารและดูแลนักศึกษาเชิงรุก
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed">
              โมเดลทำนายความเสี่ยงการตกออก (Early Warning Dropout Prediction), ระบบแนะนำวิชาเลือกตามสมรรถนะ, และผู้ช่วยถามตอบข้อมูลเชิงบริหารด้วยภาษาธรรมชาติ
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("dropout")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "dropout"
                ? "bg-purple-700 text-white shadow-md shadow-purple-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">warning</span>
            <span>ทำนายความเสี่ยงนักศึกษาตกออก ({studentList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("recommendation")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "recommendation"
                ? "bg-purple-700 text-white shadow-md shadow-purple-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>AI แนะนำวิชาเลือกและเส้นทางอาชีพ</span>
          </button>
          <button
            onClick={() => setActiveTab("copilot")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "copilot"
                ? "bg-purple-700 text-white shadow-md shadow-purple-700/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>AI Executive Copilot (สนทนาภาษาธรรมชาติ)</span>
          </button>
        </div>

        {/* Tab 1: Dropout Risk Model */}
        {activeTab === "dropout" && (
          <div className="space-y-6">
            {/* Model Architecture Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-100">
                <span className="text-[11px] text-purple-700 font-bold block mb-1">ความแม่นยำโมเดล (Accuracy)</span>
                <span className="text-2xl font-extrabold text-purple-900">92.4%</span>
                <span className="text-[10px] text-purple-600 block mt-0.5">XGBoost Classifier + SHAP</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">นักศึกษาเสี่ยงระดับวิกฤต</span>
                <span className="text-2xl font-extrabold text-rose-600">12 คน</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">จาก 4,820 คน (0.24%)</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">แทรกแซงช่วยเหลือสำเร็จ</span>
                <span className="text-2xl font-extrabold text-emerald-600">86.2%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">พ้นสภาพวิกฤตหลังอาจารย์ดูแล</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">รอบประมวลผลโมเดล</span>
                <span className="text-sm font-extrabold text-slate-800 mt-1 block">ทุกสัปดาห์ (อัตโนมัติ)</span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Sync ข้อมูล SIS/LMS</span>
              </div>
            </div>

            {/* Filter & List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">รายชื่อนักศึกษาที่อยู่ในเกณฑ์เฝ้าระวังความเสี่ยง</h3>
                  <p className="text-xs text-slate-500">จัดลำดับความสำคัญตามระดับความเสี่ยง (Risk Score) เพื่อให้อาจารย์ที่ปรึกษาเข้าช่วยเหลือทันท่วงที</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">ระดับความเสี่ยง:</span>
                  <select
                    value={selectedRiskFilter}
                    onChange={(e) => setSelectedRiskFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-800"
                  >
                    <option value="ALL">ทั้งหมด</option>
                    <option value="CRITICAL">วิกฤต (Critical)</option>
                    <option value="HIGH">สูง (High)</option>
                    <option value="MEDIUM">ปานกลาง (Medium)</option>
                    <option value="LOW">ต่ำ (Low)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {studentList
                  .filter(s => selectedRiskFilter === "ALL" || s.riskLevel === selectedRiskFilter)
                  .map((student) => (
                    <div key={student.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          student.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                          student.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                          student.riskLevel === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {student.riskScore}%
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-slate-700">{student.code}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              student.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                              student.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                              student.riskLevel === 'MEDIUM' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              ระดับ {student.riskLevel}
                            </span>
                            <span className="text-xs text-slate-500">• {student.faculty} (ปี {student.yearLevel})</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{student.name} (เกรดเฉลี่ยปัจจุบัน: {student.gpa})</h4>
                          
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {student.factors.map((f, i) => (
                              <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                                ⚠ {f}
                              </span>
                            ))}
                          </div>

                          <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                            <span className="font-bold text-purple-700 block mb-0.5">มาตรการช่วยเหลือที่ AI แนะนำ (Recommended Intervention):</span>
                            <span>{student.intervention}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col justify-end items-end gap-2 shrink-0">
                        <button
                          onClick={() => handleNotifyAdvisor(student.id, student.name)}
                          disabled={notifiedStudents[student.id]}
                          className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">notifications_active</span>
                          <span>{notifiedStudents[student.id] ? "แจ้งอาจารย์แล้ว" : "แจ้งเตือนอาจารย์ที่ปรึกษา"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Course Recommendation */}
        {activeTab === "recommendation" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">AI Course Recommendation Engine</h3>
            <p className="text-xs text-slate-500 mb-6">อัลกอริทึมจับคู่ความถนัดของนักศึกษากับวิชาเลือกเสรี (Collaborative Filtering + Graph Embedding)</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">สายงาน Data Engineer</span>
                    <span className="text-xs font-bold text-emerald-600">Match 95%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">CS-405 Big Data Architecture &amp; Pipelines</h4>
                  <p className="text-xs text-slate-600 mb-3">สถาปัตยกรรมข้อมูลขนาดใหญ่ ออกแบบ Data Lakehouse และ Apache Kafka Stream</p>
                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-700">เหตุผลที่แนะนำ:</span>
                    <span>นักศึกษาผ่านวิชา CS-301 (ฐานข้อมูล) ด้วยเกรด A และมีประวัติเข้าใช้แล็บวิเคราะห์ข้อมูลสูง</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">สายงาน Cyber Defense</span>
                    <span className="text-xs font-bold text-emerald-600">Match 91%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">CS-412 Applied Cryptography &amp; Zero Trust</h4>
                  <p className="text-xs text-slate-600 mb-3">การเข้ารหัสข้อมูลประยุกต์ การรักษาความปลอดภัยเครือข่ายองค์กร และมาตรฐาน PDPA</p>
                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-700">เหตุผลที่แนะนำ:</span>
                    <span>มีความสอดคล้องกับหัวข้องานวิจัยและเป้าหมายการสอบรับรองมาตรฐานสากล CompTIA Security+</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">สายงาน Cloud Native</span>
                    <span className="text-xs font-bold text-emerald-600">Match 88%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">CS-418 DevOps &amp; Microservices Architecture</h4>
                  <p className="text-xs text-slate-600 mb-3">การจัดการคอนเทนเนอร์ Docker, Kubernetes, Fastify และ CI/CD Pipeline อัตโนมัติ</p>
                  <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-700">เหตุผลที่แนะนำ:</span>
                    <span>นักศึกษาผ่านวิชา CS-302 (Software Engineering) ด้วยคะแนนปฏิบัติการระดับยอดเยี่ยม</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Executive AI Copilot */}
        {activeTab === "copilot" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-[640px]">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">smart_toy</span>
                  <span>College Executive AI Copilot</span>
                </h3>
                <p className="text-xs text-slate-500">ถาม-ตอบข้อมูลเชิงยุทธศาสตร์, คาดการณ์แนวโน้ม, และวิเคราะห์สมรรถนะสถาบัน</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Connected to SIS + ERP + e-Doc
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-700 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.metrics && (
                      <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                        {Object.entries(msg.metrics).map(([k, v]) => (
                          <div key={k} className="p-2 bg-white rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block">{k}</span>
                            <span className="font-bold text-slate-800 text-xs">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2 border border-slate-200">
                    <span className="material-symbols-outlined text-sm animate-spin text-purple-600">sync</span>
                    <span>AI Copilot กำลังประมวลผลข้อมูลจากฐานข้อมูลกลาง...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="pt-2 pb-3 flex flex-wrap gap-2">
              {[
                "สรุปแนวโน้มนักศึกษาที่มีความเสี่ยงตกออกปีนี้",
                "วิเคราะห์อัตราการเบิกจ่ายงบประมาณแผ่นดิน 2568",
                "เปรียบเทียบ SLA การอนุมัติคำร้องรายคณะ",
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors"
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendPrompt(chatPrompt)
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="พิมพ์คำถามเชิงบริหาร เช่น สรุปสถานะการเงิน หรือความพร้อมของระบบ..."
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!chatPrompt.trim() || isThinking}
                className="px-4 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>ส่งคำถาม</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
