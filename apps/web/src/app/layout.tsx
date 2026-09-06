import React from 'react'
import './globals.css'
import { Providers } from '../components/Providers'

export const metadata = {
  title: 'ระบบนิเวศดิจิทัลวิทยาลัย | College Portal',
  description: 'ระบบบริการการศึกษาและบริการดิจิทัลสำหรับนักศึกษาและอาจารย์',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
