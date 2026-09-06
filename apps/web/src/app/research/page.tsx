'use client'

import React, { useState } from "react"
import Link from "next/link"

interface ProposalItem {
  id: string
  title: string
  piName: string
  faculty: string
  grantType: string
  budgetRequested: number
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION'
  submittedDate: string
}

interface ActiveProjectItem {
  id: string
  code: string
  title: string
  lead: string
  allocatedBudget: number
  currentMilestone: string
  progress: number
  endDate: string
  status: 'ON_TRACK' | 'MILESTONE_DUE'
}

interface PublicationItem {
  id: string
  title: string
  authors: string
  journal: string
  indexing: string
  quartile: string
  year: number
  citations: number
  doi: string
}

interface EthicsItem {
  id: string
  protocolCode: string
  projectTitle: string
  committee: string
  approvalNo: string
  expiryDate: string
  status: 'CERTIFIED' | 'UNDER_REVIEW'
}

const initialProposals: ProposalItem[] = [
  { id: "gp-01", title: "การพัฒนาแพลตฟอร์มปัญญาประดิษฐ์ตรวจจับความเสี่ยงการตกออกของนักศึกษาในสถาบันอุดมศึกษา", piName: "รศ.ดร. นันทิยา บุญเรือง", faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", grantType: "ทุนวิจัยกองทุนส่งเสริม วช. (NRCT)", budgetRequested: 1200000, status: "APPROVED", submittedDate: "15 ก.ค. 2568" },
  { id: "gp-02", title: "การออกแบบระบบเข้ารหัสข้อมูลควอนตัมจำลองสำหรับระบบสารบรรณสถาบัน", piName: "ผศ.ดร. ธีรศักดิ์ สุวรรณรัตน์", faculty: "คณะวิศวกรรมศาสตร์", grantType: "ทุนวิจัยริเริ่มภายในสถาบัน (Seed Grant)", budgetRequested: 450000, status: "UNDER_REVIEW", submittedDate: "01 ส.ค. 2568" },
  { id: "gp-03", title: "การศึกษาผลสัมฤทธิ์การจัดการเรียนรู้แบบผสมผสานผ่าน Digital Ecosystem", piName: "ดร. กานดา วัฒนพงษ์", faculty: "คณะครุศาสตร์อุตสาหกรรม", grantType: "ทุนสนับสนุนร่วมภาคอุตสาหกรรม", budgetRequested: 350000, status: "SUBMITTED", submittedDate: "10 ส.ค. 2568" },
]

const initialProjects: ActiveProjectItem[] = [
  { id: "proj-1", code: "RES-68-012", title: "การพัฒนาสถาปัตยกรรม Microservices ปลอดภัยตามมาตรฐาน PDPA", lead: "รศ.ดร. นันทิยา บุญเรือง", allocatedBudget: 950000, currentMilestone: "งวดที่ 2 (ส่งมอบโค้ดต้นแบบและระบบ Audit Trail)", progress: 65, endDate: "30 มี.ค. 2569", status: "ON_TRACK" },
  { id: "proj-2", code: "RES-67-089", title: "ระบบตรวจวัดและบริหารพลังงานอัจฉริยะภายในอาคารเรียนเฉลิมพระเกียรติ", lead: "ผศ.ดร. ประเสริฐ ธนากุล", allocatedBudget: 1800000, currentMilestone: "งวดที่ 3 (ติดตั้ง IoT Gateway และจัดทำรายงานสรุป)", progress: 85, endDate: "15 พ.ย. 2568", status: "MILESTONE_DUE" },
]

const initialPublications: PublicationItem[] = [
  { id: "pub-1", title: "Zero-Trust Identity Federation in Higher Education Portals", authors: "Boonruang, N., Suwanrat, T., & Kanda, W.", journal: "IEEE Transactions on Learning Technologies", indexing: "Scopus", quartile: "Q1", year: 2025, citations: 14, doi: "10.1109/TLT.2025.321890" },
  { id: "pub-2", title: "Automated Seat Locking Mechanics in High-Concurrency SIS Architecture", authors: "Suwanrat, T., & Wongsuwan, S.", journal: "Journal of Systems Architecture", indexing: "Scopus", quartile: "Q1", year: 2024, citations: 29, doi: "10.1016/j.sysarc.2024.102911" },
  { id: "pub-3", title: "การประเมินความพึงพอใจการใช้งานระบบลงนามดิจิทัลภาครัฐตามระเบียบสารบรรณอิเล็กทรอนิกส์", authors: "สมชาย เกียรติสกุล", journal: "วารสารวิชาการและวิจัย มทร.พระนคร", indexing: "TCI กลุ่ม 1", quartile: "Tier 1", year: 2025, citations: 8, doi: "10.14456/jrmutp.2025.12" },
]

const initialEthics: EthicsItem[] = [
  { id: "eth-1", protocolCode: "IRB-2568-041", projectTitle: "การวิเคราะห์พฤติกรรมการเรียนรู้ของนักศึกษาผ่าน Big Data และการคุ้มครองข้อมูลส่วนบุคคล", committee: "คณะกรรมการจริยธรรมการวิจัยในมนุษย์ สาขาสังคมศาสตร์", approvalNo: "COA. 041/2568", expiryDate: "14 ก.ค. 2569", status: "CERTIFIED" },
  { id: "eth-2", protocolCode: "IRB-2568-088", projectTitle: "การทดสอบการใช้งานแอปพลิเคชันช่วยเหลือการเคลื่อนไหวสำหรับผู้พิการ", committee: "คณะกรรมการจริยธรรมการวิจัยในมนุษย์ สาขาวิทยาศาสตร์สุขภาพ", approvalNo: "อยู่ระหว่างพิจารณาเอกสารรอบ 2", expiryDate: "30 ต.ค. 2568", status: "UNDER_REVIEW" },
]

export default function ResearchPortalPage() {
  const [activeTab, setActiveTab] = useState<"proposals" | "projects" | "publications" | "ethics">("proposals")
  const [proposals, setProposals] = useState<ProposalItem[]>(initialProposals)
  const [showNewProposalModal, setShowNewProposalModal] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>("")
  const [newPiName, setNewPiName] = useState<string>("")
  const [newGrantType, setNewGrantType] = useState<string>("ทุนวิจัยริเริ่มภายในสถาบัน (Seed Grant)")
  const [newBudget, setNewBudget] = useState<string>("300000")
  const [successNotice, setSuccessNotice] = useState<string | null>(null)

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newPiName) return
    const newItem: ProposalItem = {
      id: `gp-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      piName: newPiName,
      faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
      grantType: newGrantType,
      budgetRequested: parseFloat(newBudget) || 300000,
      status: "SUBMITTED",
      submittedDate: "วันนี้",
    }
    setProposals([newItem, ...proposals])
    setSuccessNotice(`ส่งข้อเสนอโครงการ "${newTitle}" เข้าสู่กระบวนการพิจารณาเรียบร้อยแล้ว`)
    setShowNewProposalModal(false)
    setNewTitle("")
    setNewPiName("")
    setTimeout(() => setSuccessNotice(null), 5000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>ศูนย์บริการกลาง</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                RES
              </div>
              <h1 className="text-base font-bold text-slate-900">
                ระบบบริหารงานวิจัยและผลงานวิชาการ
              </h1>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Post-MVP Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewProposalModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>ยื่นข้อเสนอขอทุนวิจัย</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-medium backdrop-blur-md mb-3">
              <span className="material-symbols-outlined text-sm">science</span>
              <span>Research Grants & Academic Publications Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              ศูนย์ส่งเสริมการวิจัย นวัตกรรม และคลังผลงานวิชาการสถาบัน
            </h2>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              บริหารจัดการวงจรทุนวิจัยครบวงจร (Grant Lifecycle), ติดตามงวดรายงานความก้าวหน้า, ตรวจสอบจริยธรรมการวิจัย (IRB) และสืบค้นบทความตีพิมพ์ระดับนานาชาติ Scopus/TCI
            </p>
          </div>
        </div>

        {successNotice && (
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center gap-3 text-sm animate-fade-in shadow-sm">
            <span className="material-symbols-outlined text-teal-600">check_circle</span>
            <span>{successNotice}</span>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">ทุนวิจัยที่ดำเนินการ</span>
            <span className="text-2xl font-extrabold text-slate-900">2 โครงการ</span>
            <span className="text-[11px] text-teal-600 block mt-1 font-semibold">งบประมาณรวม 2.75 ล้านบาท</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">ข้อเสนอรอพิจารณา</span>
            <span className="text-2xl font-extrabold text-slate-900">{proposals.filter(p => p.status !== 'APPROVED').length} รายการ</span>
            <span className="text-[11px] text-amber-600 block mt-1 font-semibold">Peer Reviewers คัดกรอง</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">ผลงานตีพิมพ์ Scopus/TCI</span>
            <span className="text-2xl font-extrabold text-slate-900">42 บทความ</span>
            <span className="text-[11px] text-indigo-600 block mt-1 font-semibold">Q1 สัดส่วน 45%</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">รับรองจริยธรรม IRB</span>
            <span className="text-2xl font-extrabold text-slate-900">100%</span>
            <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">ผ่านเกณฑ์จริยธรรมสากล</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("proposals")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "proposals"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">description</span>
            <span>ข้อเสนอขอทุนวิจัย ({proposals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "projects"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">track_changes</span>
            <span>ติดตามงวดงานโครงการ ({initialProjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("publications")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "publications"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">menu_book</span>
            <span>คลังผลงานตีพิมพ์ Scopus/TCI ({initialPublications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("ethics")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "ethics"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <span>จริยธรรมการวิจัย (IRB) ({initialEthics.length})</span>
          </button>
        </div>

        {/* Tab 1: Proposals */}
        {activeTab === "proposals" && (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    proposal.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    proposal.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {proposal.status === 'APPROVED' ? 'verified' : proposal.status === 'UNDER_REVIEW' ? 'find_in_page' : 'send'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {proposal.grantType}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        proposal.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        proposal.status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {proposal.status === 'APPROVED' ? 'อนุมัติจัดสรรทุนแล้ว' : proposal.status === 'UNDER_REVIEW' ? 'อยู่ระหว่างประเมินข้อเสนอ' : 'ส่งข้อเสนอแล้ว'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{proposal.title}</h3>
                    <p className="text-xs text-slate-500">
                      หัวหน้าโครงการ: {proposal.piName} • {proposal.faculty} • ยื่นเมื่อ: {proposal.submittedDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right mb-2">
                    <span className="text-xs text-slate-400 block">งบประมาณที่ขอ</span>
                    <span className="text-lg font-extrabold text-teal-700">
                      ฿{proposal.budgetRequested.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`ดูรายละเอียดข้อเสนอโครงการ: ${proposal.title}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    เปิดดูข้อเสนอโครงการ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {initialProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                      {project.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{project.title}</h3>
                    <p className="text-xs text-slate-500">หัวหน้าโครงการ: {project.lead} • สิ้นสุดสัญญา: {project.endDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">งบประมาณที่จัดสรร</span>
                    <span className="text-lg font-extrabold text-slate-900">฿{project.allocatedBudget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>งวดงานปัจจุบัน: {project.currentMilestone}</span>
                    <span>ความก้าวหน้าโครงการ {project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => alert(`เปิดส่งรายงานงวดงาน: ${project.code}`)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-md shadow-teal-600/20"
                  >
                    ส่งรายงานงวดงานดิจิทัล
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Publications */}
        {activeTab === "publications" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm divide-y divide-slate-100">
            {initialPublications.map((pub) => (
              <div key={pub.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {pub.indexing} {pub.quartile}
                    </span>
                    <span className="text-xs text-slate-400">ปีที่พิมพ์ {pub.year}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{pub.title}</h4>
                  <p className="text-xs text-slate-600 mb-1">{pub.authors}</p>
                  <p className="text-xs text-slate-500 italic mb-2">{pub.journal}</p>
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">link</span>
                    <span>DOI: {pub.doi}</span>
                  </a>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[90px]">
                    <span className="text-[11px] text-slate-400 block">Citations</span>
                    <span className="text-base font-extrabold text-slate-800">{pub.citations} ครั้ง</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Ethics */}
        {activeTab === "ethics" && (
          <div className="space-y-4">
            {initialEthics.map((eth) => (
              <div key={eth.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {eth.protocolCode}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {eth.status === 'CERTIFIED' ? 'ได้รับการรับรองจริยธรรมแล้ว' : 'อยู่ระหว่างประเมิน'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{eth.projectTitle}</h3>
                    <p className="text-xs text-slate-500 mb-1">{eth.committee}</p>
                    <p className="text-xs text-slate-700 font-medium">เลขที่ใบรับรอง: {eth.approvalNo} • วันหมดอายุ: {eth.expiryDate}</p>
                  </div>
                </div>

                <div className="flex sm:items-end justify-end">
                  <button
                    onClick={() => alert(`ดาวน์โหลดใบรับรองจริยธรรม: ${eth.protocolCode}`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>ดาวน์โหลด COA Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: New Proposal */}
        {showNewProposalModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">ยื่นข้อเสนอโครงการวิจัยใหม่</h3>
                <button
                  onClick={() => setShowNewProposalModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อโครงการวิจัย (ไทย/อังกฤษ)</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="เช่น การพัฒนาโมเดลปัญญาประดิษฐ์เพื่อการทำนาย..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-สกุล หัวหน้าโครงการวิจัย</label>
                  <input
                    type="text"
                    required
                    value={newPiName}
                    onChange={(e) => setNewPiName(e.target.value)}
                    placeholder="เช่น ผศ.ดร. นันทิยา บุญเรือง"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">แหล่งทุนสนับสนุน</label>
                  <select
                    value={newGrantType}
                    onChange={(e) => setNewGrantType(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ทุนวิจัยริเริ่มภายในสถาบัน (Seed Grant)">ทุนวิจัยริเริ่มภายในสถาบัน (Seed Grant)</option>
                    <option value="ทุนวิจัยกองทุนส่งเสริม วช. (NRCT)">ทุนวิจัยกองทุนส่งเสริม วช. (NRCT)</option>
                    <option value="ทุนสนับสนุนร่วมภาคอุตสาหกรรม">ทุนสนับสนุนร่วมภาคอุตสาหกรรม (Industry Matching Grant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">งบประมาณที่ขอสนับสนุน (บาท)</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewProposalModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                  >
                    ยื่นข้อเสนอโครงการวิจัย
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
