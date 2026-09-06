import React from 'react'
import './globals.css'
import { Providers } from '../components/Providers'

export const metadata = {
  title: 'Admin Console & Executive Dashboard | College Digital',
  description: 'ระบบบริหารจัดการและแดชบอร์ดผู้บริหาร',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
