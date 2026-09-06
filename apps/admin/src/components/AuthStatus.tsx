'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut, User, Shield } from 'lucide-react'

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="text-xs text-slate-400">...</span>
  }

  if (status === 'loading') {
    return <span className="text-xs text-slate-400 animate-pulse">กำลังตรวจสอบสิทธิ์...</span>
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn()}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-deep hover:bg-navy-surface text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
      >
        <LogIn size={15} />
        เข้าสู่ระบบ Admin
      </button>
    )
  }

  const role = session.user.roles?.[0] || 'admin'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-right">
        <div className="w-8 h-8 rounded-full bg-blue-subtle flex items-center justify-center text-navy-surface">
          <User size={18} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">
            {session.user.name || session.user.email}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
            <Shield size={11} />
            <span className="bg-blue-subtle text-navy-deep px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">{role}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 rounded-md text-xs font-medium transition-colors cursor-pointer"
      >
        <LogOut size={13} />
        ออกจากระบบ
      </button>
    </div>
  )
}
