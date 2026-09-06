'use client'

import React, { useState } from 'react'

export interface CampusOption {
  id: string
  code: string
  nameTh: string
  nameEn: string
  isMain: boolean
  students: number
  staff: number
}

export const campusOptions: CampusOption[] = [
  { id: 'all', code: 'ALL-NET', nameTh: 'ทุกวิทยาเขตในเครือ (Consolidated Network)', nameEn: 'All Campuses (Consolidated)', isMain: false, students: 7040, staff: 507 },
  { id: 'main', code: 'BKK-MAIN', nameTh: 'วิทยาเขตหลัก (กรุงเทพมหานคร)', nameEn: 'Bangkok Main Campus', isMain: true, students: 4820, staff: 340 },
  { id: 'east', code: 'PRC-EAST', nameTh: 'วิทยาเขตปราจีนบุรี (ภาคตะวันออก)', nameEn: 'Prachinburi Eastern Campus', isMain: false, students: 1240, staff: 95 },
  { id: 'north', code: 'CNX-NORTH', nameTh: 'วิทยาลัยเทคโนโลยีในเครือ (เชียงใหม่)', nameEn: 'Northern Tech College', isMain: false, students: 980, staff: 72 },
]

export function CampusSwitcher() {
  const [selectedCampus, setSelectedCampus] = useState<string>('main')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [switchNotice, setSwitchNotice] = useState<string | null>(null)

  const current = campusOptions.find(c => c.id === selectedCampus) || campusOptions[1]

  const handleSelect = (id: string) => {
    setSelectedCampus(id)
    setIsOpen(false)
    const target = campusOptions.find(c => c.id === id)
    if (target) {
      setSwitchNotice(`สลับสถาบัน/วิทยาเขตเป็น: ${target.nameTh}`)
      setTimeout(() => setSwitchNotice(null), 3500)
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-sm"
        title="สลับวิทยาเขต / สถาบันในเครือ (Multi-institution Network)"
      >
        <span className="material-symbols-outlined text-base text-indigo-600">domain</span>
        <span className="max-w-[140px] truncate hidden sm:inline">{current.nameTh}</span>
        <span className="sm:hidden">{current.code}</span>
        <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-scale-up">
          <div className="px-3 py-2 border-b border-slate-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Multi-institution Campus Selector
            </span>
            <span className="text-xs text-slate-500">เลือกสถาบันหรือวิทยาเขตเพื่อปรับปรุงบริบทข้อมูล</span>
          </div>

          <div className="p-1 space-y-1">
            {campusOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                  selectedCampus === c.id ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">{c.nameTh}</span>
                    {c.isMain && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-extrabold">
                        MAIN
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {c.students.toLocaleString()} นักศึกษา • {c.staff} บุคลากร
                  </span>
                </div>
                {selectedCampus === c.id && (
                  <span className="material-symbols-outlined text-sm text-indigo-600">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {switchNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <span>{switchNotice}</span>
        </div>
      )}
    </div>
  )
}
