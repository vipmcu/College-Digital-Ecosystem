'use client'

import React, { useState } from "react"
import Link from "next/link"
import { CampusSwitcher } from "../../components/campus-switcher"

interface UserAccount {
  id: string
  username: string
  nameTh: string
  nameEn: string
  email: string
  userType: "admin" | "instructor" | "staff" | "student"
  roles: string[]
  mfaEnabled: boolean
  pdpaConsent: boolean
  isActive: boolean
}

const initialUsers: UserAccount[] = [
  {
    id: "usr-01",
    username: "admin",
    nameTh: "ผู้ดูแล ระบบสารสนเทศ",
    nameEn: "System Administrator",
    email: "admin@college.ac.th",
    userType: "admin",
    roles: ["it_admin"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
  {
    id: "usr-02",
    username: "dean.cs",
    nameTh: "ศ.ดร. ประเสริฐ สุขใจ",
    nameEn: "Prof. Dr. Prasert Sukjai",
    email: "dean.cs@college.ac.th",
    userType: "instructor",
    roles: ["executive", "instructor"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
  {
    id: "usr-03",
    username: "reg.officer",
    nameTh: "นางสมศรี มีสุข",
    nameEn: "Mrs. Somsri Meesook",
    email: "reg01@college.ac.th",
    userType: "staff",
    roles: ["registrar"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
  {
    id: "usr-04",
    username: "doc.officer",
    nameTh: "นายวินัย มั่นคง",
    nameEn: "Mr. Winai Mankhong",
    email: "doc01@college.ac.th",
    userType: "staff",
    roles: ["document_officer"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
  {
    id: "usr-05",
    username: "dpo.officer",
    nameTh: "นายเอกชัย ปกป้อง",
    nameEn: "Mr. Ekkachai Pokpong",
    email: "dpo@college.ac.th",
    userType: "staff",
    roles: ["dpo"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
  {
    id: "usr-06",
    username: "student01",
    nameTh: "นายธนภัทร สิริวัฒนกุล",
    nameEn: "Mr. Thanaphat Siriwatanakul",
    email: "student01@college.ac.th",
    userType: "student",
    roles: ["student"],
    mfaEnabled: true,
    pdpaConsent: true,
    isActive: true,
  },
]

const ALL_ROLES = [
  { id: "it_admin", label: "IT Administrator (it_admin)" },
  { id: "executive", label: "ผู้บริหารระดับสูง (executive)" },
  { id: "instructor", label: "อาจารย์ผู้สอน (instructor)" },
  { id: "registrar", label: "เจ้าหน้าที่สำนักทะเบียน (registrar)" },
  { id: "document_officer", label: "เจ้าหน้าที่สารบรรณ (document_officer)" },
  { id: "dpo", label: "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (dpo)" },
  { id: "student", label: "นักศึกษา (student)" },
]

export default function UsersGovernancePage() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [userForEditRoles, setUserForEditRoles] = useState<UserAccount | null>(null)
  const [userForResetPassword, setUserForResetPassword] = useState<UserAccount | null>(null)

  // Add User Form state
  const [newUsername, setNewUsername] = useState("")
  const [newNameTh, setNewNameTh] = useState("")
  const [newNameEn, setNewNameEn] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newUserType, setNewUserType] = useState<"admin" | "instructor" | "staff" | "student">("staff")
  const [newRoles, setNewRoles] = useState<string[]>(["document_officer"])
  const [newMfa, setNewMfa] = useState(true)
  const [newPdpa, setNewPdpa] = useState(true)

  // Edit Roles state
  const [editingRoles, setEditingRoles] = useState<string[]>([])
  const [editingActive, setEditingActive] = useState(true)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleOpenEditRoles = (user: UserAccount) => {
    setUserForEditRoles(user)
    setEditingRoles([...user.roles])
    setEditingActive(user.isActive)
  }

  const handleSaveEditRoles = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userForEditRoles) return

    setUsers(
      users.map((u) =>
        u.id === userForEditRoles.id
          ? { ...u, roles: editingRoles, isActive: editingActive }
          : u
      )
    )
    showToast(`อัปเดตสิทธิ์ RBAC สำหรับ ${userForEditRoles.username} เสร็จสมบูรณ์`)
    setUserForEditRoles(null)
  }

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim() || !newEmail.trim()) return

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: newUsername.trim(),
      nameTh: newNameTh.trim() || newUsername,
      nameEn: newNameEn.trim() || newUsername,
      email: newEmail.trim(),
      userType: newUserType,
      roles: newRoles.length > 0 ? newRoles : ["staff"],
      mfaEnabled: newMfa,
      pdpaConsent: newPdpa,
      isActive: true,
    }

    setUsers([newUser, ...users])
    setShowAddUserModal(false)
    setNewUsername("")
    setNewNameTh("")
    setNewNameEn("")
    setNewEmail("")
    setNewRoles(["document_officer"])
    showToast(`เพิ่มผู้ใช้งาน ${newUser.username} เข้าสู่ระบบ Keycloak SSO เรียบร้อยแล้ว`)
  }

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userForResetPassword) return
    showToast(`สร้างรหัสผ่านชั่วคราวและส่งไปยังอีเมล ${userForResetPassword.email} เรียบร้อยแล้ว`)
    setUserForResetPassword(null)
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.roles.includes(roleFilter) || u.userType === roleFilter
    const matchesSearch =
      search === "" ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.nameTh.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchesRole && matchesSearch
  })

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
              <div className="w-8 h-8 rounded-lg bg-navy-deep text-amber-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-lg">manage_accounts</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Identity &amp; Governance
                </span>
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant ml-2">
                  ระบบบัญชีกลางและธรรมาภิบาลข้อมูล (M01/M06)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <CampusSwitcher />
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-space-md py-2 bg-primary hover:bg-navy-deep text-surface-card font-label-md text-label-md font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>เพิ่มผู้ใช้งานใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="w-full bg-surface-canvas flex-1 pb-space-3xl">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-navy-deep text-surface-card px-space-md py-space-sm rounded-xl shadow-xl border border-navy-surface flex items-center gap-space-sm animate-bounce">
            <span className="material-symbols-outlined text-status-success">check_circle</span>
            <span className="font-body-sm text-body-sm">{toastMsg}</span>
          </div>
        )}

        {/* Top Context Sub-bar */}
        <section className="w-full bg-navy-deep text-on-primary py-space-lg shadow-xs">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
              <div className="space-y-space-2xs">
                <div className="flex items-center gap-space-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-container text-primary-fixed-dim uppercase tracking-wider">
                    โมดูล M01 / M06 • SSO &amp; PDPA
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm bg-status-success/20 text-status-success">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    ISO/IEC 27001 Certified
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm bg-blue-accent/20 text-primary-fixed-dim">
                    <span className="material-symbols-outlined text-xs">lock</span>
                    AES-256-GCM PII Encryption
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-surface-card tracking-tight font-bold">
                  การบริหารจัดการบัญชีผู้ใช้งาน และธรรมาภิบาลข้อมูลส่วนบุคคล
                </h1>
                <p className="text-xs text-surface-container-high">
                  ระบบบริหารจัดการบัญชีแบบรวมศูนย์ (Single Sign-On), การกำหนดสิทธิ์ตามบทบาท (RBAC) และการกำกับดูแลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                </p>
              </div>

              <div className="flex items-center gap-space-sm bg-navy-surface/80 p-space-sm rounded-xl border border-navy-surface">
                <span className="material-symbols-outlined text-status-success text-2xl">policy</span>
                <div className="text-xs">
                  <div className="font-bold text-surface-card">DPO Audit Engine</div>
                  <div className="text-slate-300">ความยินยอม PDPA ครบถ้วน 100%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle">
              <span className="text-xs text-outline font-semibold uppercase">ผู้ใช้งานในระบบทั้งหมด</span>
              <div className="font-display-lg text-display-lg font-bold text-navy-deep my-1">128</div>
              <span className="text-xs text-status-success font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">check</span> ใช้งานปกติทุกบัญชี
              </span>
            </div>

            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle">
              <span className="text-xs text-outline font-semibold uppercase">เปิดใช้งาน 2-Factor MFA</span>
              <div className="font-display-lg text-display-lg font-bold text-secondary my-1">98.2%</div>
              <span className="text-xs text-secondary font-semibold">126 / 128 บัญชี</span>
            </div>

            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle">
              <span className="text-xs text-outline font-semibold uppercase">บันทึกเข้าถึงข้อมูล PII</span>
              <div className="font-display-lg text-display-lg font-bold text-amber-primary my-1">1,420</div>
              <span className="text-xs text-amber-primary font-semibold">Audit Logs มีการเข้ารหัส</span>
            </div>

            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle">
              <span className="text-xs text-outline font-semibold uppercase">สถานะความยินยอม PDPA</span>
              <div className="font-display-lg text-display-lg font-bold text-status-success my-1">100%</div>
              <span className="text-xs text-status-success font-semibold">ไม่มีข้อพิพาทคงค้าง</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="ค้นหาชื่อ, username, อีเมลผู้ใช้งาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-container-low pl-10 pr-4 py-2 text-xs rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex items-center gap-space-sm">
              <span className="text-xs text-outline font-semibold">บทบาท (Role):</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2 text-xs font-semibold text-navy-deep focus:outline-none"
              >
                <option value="all">ทั้งหมด (All Roles)</option>
                <option value="it_admin">IT Admin</option>
                <option value="executive">ผู้บริหาร (Executive)</option>
                <option value="instructor">อาจารย์ผู้สอน (Instructor)</option>
                <option value="registrar">เจ้าหน้าที่ทะเบียน (Registrar)</option>
                <option value="student">นักศึกษา (Student)</option>
                <option value="dpo">เจ้าหน้าที่ DPO</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-surface-card rounded-xl shadow-xs border border-border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-border-subtle">
                  <tr>
                    <th className="py-3 px-4">ผู้ใช้งาน (User Profile)</th>
                    <th className="py-3 px-4">ชื่อผู้ใช้ (Username)</th>
                    <th className="py-3 px-4">สิทธิ์ในระบบ (RBAC Roles)</th>
                    <th className="py-3 px-4 text-center">MFA</th>
                    <th className="py-3 px-4 text-center">ยินยอม PDPA</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-9 h-9 rounded-full bg-blue-subtle text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                            {u.nameTh.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-navy-deep text-xs">{u.nameTh}</div>
                            <div className="text-[11px] text-outline">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs font-semibold text-secondary">
                        {u.username}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-navy-deep border border-border-subtle"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success text-[10px] font-bold">
                          เปิดใช้งาน
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-subtle text-secondary text-[10px] font-bold">
                          ยินยอมแล้ว
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditRoles(u)}
                            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-navy-deep text-xs font-semibold transition-colors cursor-pointer"
                          >
                            แก้ไขสิทธิ์
                          </button>
                          <button
                            onClick={() => setUserForResetPassword(u)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            รีเซ็ตรหัส
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl max-w-xl w-full shadow-2xl border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-primary text-xl">person_add</span>
                <h3 className="font-headline-sm text-base font-bold text-white">
                  เพิ่มบัญชีผู้ใช้งานใหม่ (SSO &amp; RBAC)
                </h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                      ชื่อผู้ใช้ (Username) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น somchai.j"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                      อีเมลสถาบัน (@college.ac.th) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="somchai.j@college.ac.th"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                      ชื่อ-นามสกุล (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      placeholder="นายสมชาย ใจดี"
                      value={newNameTh}
                      onChange={(e) => setNewNameTh(e.target.value)}
                      className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                      Full Name (English)
                    </label>
                    <input
                      type="text"
                      placeholder="Mr. Somchai Jaidee"
                      value={newNameEn}
                      onChange={(e) => setNewNameEn(e.target.value)}
                      className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-1">
                    ประเภทผู้ใช้งาน (User Classification)
                  </label>
                  <select
                    value={newUserType}
                    onChange={(e) => setNewUserType(e.target.value as typeof newUserType)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg p-2.5 text-xs text-navy-deep font-semibold focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="staff">เจ้าหน้าที่สายสนับสนุน (Staff)</option>
                    <option value="instructor">อาจารย์ผู้สอน / นักวิจัย (Instructor)</option>
                    <option value="admin">ผู้ดูแลระบบสารสนเทศ (Administrator)</option>
                    <option value="student">นักศึกษา (Student)</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-navy-deep font-bold block mb-2">
                    กำหนดบทบาทและสิทธิ์การเข้าถึง (RBAC Roles)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                    {ALL_ROLES.map((role) => {
                      const isChecked = newRoles.includes(role.id)
                      return (
                        <label
                          key={role.id}
                          className="flex items-center gap-2 text-xs text-navy-deep cursor-pointer p-1 rounded hover:bg-surface-card"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRoles([...newRoles, role.id])
                              } else {
                                setNewRoles(newRoles.filter((r) => r !== role.id))
                              }
                            }}
                            className="rounded text-primary focus:ring-secondary"
                          />
                          <span>{role.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle space-y-2 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-navy-deep">เปิดใช้งาน 2-Factor Authentication (MFA)</span>
                    <input
                      type="checkbox"
                      checked={newMfa}
                      onChange={(e) => setNewMfa(e.target.checked)}
                      className="rounded text-primary focus:ring-secondary"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-navy-deep">บันทึกความยินยอม PDPA Consent เริ่มต้น</span>
                    <input
                      type="checkbox"
                      checked={newPdpa}
                      onChange={(e) => setNewPdpa(e.target.checked)}
                      className="rounded text-primary focus:ring-secondary"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>บันทึกและสร้างบัญชี</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit RBAC Roles Modal */}
      {userForEditRoles && (
        <div className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl max-w-lg w-full shadow-2xl border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-primary text-xl">admin_panel_settings</span>
                <h3 className="font-headline-sm text-base font-bold text-white">
                  แก้ไขสิทธิ์ RBAC: {userForEditRoles.username}
                </h3>
              </div>
              <button
                onClick={() => setUserForEditRoles(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditRoles}>
              <div className="p-space-lg space-y-space-md">
                <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-navy-deep">{userForEditRoles.nameTh}</div>
                    <div className="text-outline">{userForEditRoles.email}</div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-navy-deep">
                    <span>สถานะบัญชี:</span>
                    <input
                      type="checkbox"
                      checked={editingActive}
                      onChange={(e) => setEditingActive(e.target.checked)}
                      className="rounded text-primary focus:ring-secondary"
                    />
                    <span className={editingActive ? "text-status-success" : "text-red-500"}>
                      {editingActive ? "ใช้งานอยู่" : "ระงับการใช้งาน"}
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="font-label-sm text-label-sm text-navy-deep font-bold block">
                    เลือกสิทธิ์การเข้าถึงระบบที่อนุญาต:
                  </span>
                  <div className="space-y-1.5 bg-surface-container-low p-3 rounded-xl border border-border-subtle">
                    {ALL_ROLES.map((role) => {
                      const isChecked = editingRoles.includes(role.id)
                      return (
                        <label
                          key={role.id}
                          className="flex items-center gap-2.5 text-xs text-navy-deep cursor-pointer p-1.5 rounded hover:bg-surface-card"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditingRoles([...editingRoles, role.id])
                              } else {
                                setEditingRoles(editingRoles.filter((r) => r !== role.id))
                              }
                            }}
                            className="rounded text-primary focus:ring-secondary"
                          />
                          <span className="font-medium">{role.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
                <button
                  type="button"
                  onClick={() => setUserForEditRoles(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-navy-deep text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {userForResetPassword && (
        <div className="fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl max-w-md w-full shadow-2xl border border-border-subtle overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-navy-deep px-space-lg py-space-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-primary text-xl">lock_reset</span>
                <h3 className="font-headline-sm text-base font-bold text-white">
                  รีเซ็ตรหัสผ่านบัญชี SSO
                </h3>
              </div>
              <button
                onClick={() => setUserForResetPassword(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword}>
              <div className="p-space-lg space-y-space-md">
                <div className="p-3.5 bg-amber-primary/10 border border-amber-primary/30 rounded-xl text-xs text-navy-deep flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-primary text-xl shrink-0">info</span>
                  <p>
                    ระบบจะสร้างรหัสผ่านชั่วคราว (Temporary Password) และจัดส่งไปยังอีเมลทางการศึกษาของผู้ใช้งานโดยอัตโนมัติ พร้อมบังคับให้เปลี่ยนรหัสผ่านทันทีเมื่อล็อกอิน
                  </p>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-subtle space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-outline">ชื่อผู้ใช้:</span>
                    <strong className="font-mono text-secondary">{userForResetPassword.username}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">ชื่อ-นามสกุล:</span>
                    <strong className="text-navy-deep">{userForResetPassword.nameTh}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">อีเมลปลายทาง:</span>
                    <strong className="text-navy-deep">{userForResetPassword.email}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low px-space-lg py-space-sm border-t border-border-subtle flex items-center justify-end gap-space-sm">
                <button
                  type="button"
                  onClick={() => setUserForResetPassword(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-primary hover:bg-amber-600 text-white font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>ยืนยันส่งรหัสผ่านใหม่</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Footer */}
      <footer className="w-full bg-navy-deep text-on-primary py-space-md border-t border-navy-surface mt-auto">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-xs text-primary-fixed-dim">
          <span>College Identity &amp; Governance Platform • Module 01 &amp; 06</span>
          <span>&copy; 2569 ข้อมูลส่วนบุคคลอยู่ภายใต้การคุ้มครองตามกฎหมาย</span>
        </div>
      </footer>
    </div>
  )
}
