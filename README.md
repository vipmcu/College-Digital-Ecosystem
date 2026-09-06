<div align="center">

<img src="docs/screenshots/00-logo.png" alt="College Digital Ecosystem Logo" width="220" />

# College Digital Ecosystem MVP
### ระบบนิเวศดิจิทัลเพื่อการศึกษาและการบริการสารสนเทศแบบครบวงจร

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.28-black?style=for-the-badge&logo=fastify)](https://www.fastify.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.10-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)

</div>

---

## 📸 แกลเลอรีภาพตัวอย่างหน้าจอระบบ (GUI Showcase)

ระบบถูกออกแบบภายใต้ **Google Stitch Design System** เน้นโทนสีสถาบัน Deep Navy (`#081B54`), Amber Gold (`#D97706`) และ Modern Surface Canvas พร้อมฟอนต์ภาษาไทย **Sarabun** และ **Plus Jakarta Sans** รองรับ Responsive Desktop & Mobile 100%

### 1. Web Portal — ศูนย์บริการดิจิทัลนักศึกษาและบุคลากร (Service Hub)
หน้าพอร์ทัลหลักสำหรับนักศึกษา อาจารย์ และบุคลากร ในการเข้าถึงบริการลงทะเบียน ส่งคำร้องออนไลน์ และตรวจสอบสถานะคำร้อง

<p align="center">
  <img src="docs/screenshots/01-service-hub-web-portal.png" alt="Web Portal Service Hub" width="95%" />
</p>

---

### 2. Admin Console — แดชบอร์ดผู้บริหารและการตรวจสอบระบบ (Executive Dashboard)
ศูนย์กลางการบริหารจัดการระบบ, การวิเคราะห์ข้อมูลสถิติ (KPIs), ตรวจสอบความพร้อมของ Microservices และตรวจสอบ Audit Logs แบบ Real-time

<p align="center">
  <img src="docs/screenshots/02-executive-dashboard-admin.png" alt="Executive Dashboard & Admin Console" width="95%" />
</p>

---

### 3. Core SIS Portal — ระบบทะเบียนและบริการการศึกษา (Student Information System)
ระบบจัดการหลักสูตร, แผนการเรียน, ตารางสอน, ตารางสอบ และระบบลงทะเบียนเรียนพร้อม Atomic Seat Locking ป้องกันการลงทะเบียนเกินจำนวนที่นั่ง

<p align="center">
  <img src="docs/screenshots/03-core-sis-portal.png" alt="Core SIS Portal" width="95%" />
</p>

---

### 4. e-Document & Approval Workflow — ระบบเอกสารดิจิทัลและการอนุมัติ
ระบบติดตามกระบวนการไหลของคำร้องและการลงนามดิจิทัล (Digital Signature with SHA-256) ตรวจสอบความถูกต้องของเอกสารได้ทันที

<p align="center">
  <img src="docs/screenshots/04-e-document-approval-workflow.png" alt="e-Document Approval Workflow" width="95%" />
</p>

---

### 5. PDPA & Identity Governance — การจัดการความปลอดภัยและข้อมูลส่วนบุคคล
ระบบบริหารจัดการสิทธิ์ (RBAC), ตรวจสอบการเข้าถึงข้อมูลที่มีความอ่อนไหว (PII Access Audit Log) และการเข้ารหัส AES-256-GCM ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)

<p align="center">
  <img src="docs/screenshots/05-pdpa-identity-security.png" alt="PDPA and Identity Security Governance" width="95%" />
</p>

---

### 6. Mobile Experience — ระบบบริการการศึกษาและทรานสคริปต์บนมือถือ
รองรับการแสดงผลหน้าทะเบียน ผลการเรียน ทรานสคริปต์ดิจิทัล และตารางเรียนอย่างสมบูรณ์แบบบนสมาร์ตโฟน พร้อม Progressive Web App (PWA) ติดตั้งลงหน้าจอโฮมได้ทันที

<p align="center">
  <img src="docs/screenshots/06-core-sis-mobile.png" alt="Core SIS Mobile" width="45%" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/07-mobile-transcript.png" alt="Mobile Transcript" width="45%" />
</p>

---

### 7. Post-MVP Enterprise Extensions Suite (Phase 4 สมบูรณ์ 100%)
* **LMS (ห้องเรียนออนไลน์ & คลังบทเรียน)**: [http://localhost:3000/lms](http://localhost:3000/lms) — ห้องเรียนเสมือนจริง, สื่อการสอนวิดีโอ, กล่องส่งการบ้านพร้อมตรวจจับเวลา & ตรวจสอบ SHA-256 Checksum, ศูนย์แบบทดสอบออนไลน์
* **Research & Publications Portal**: [http://localhost:3000/research](http://localhost:3000/research) — ยื่นขอทุนวิจัย วช./NRCT, ติดตามงวดงานโครงการ, คลังผลงานตีพิมพ์ระดับนานาชาติ Scopus (Q1/Q2) และ TCI กลุ่ม 1, รับรองจริยธรรมการวิจัย (IRB)
* **ERP Finance Dashboard**: [http://localhost:3001/finance](http://localhost:3001/finance) — แดชบอร์ดงบประมาณประจำปี (฿185.4M), สมุดรายวันทั่วไป (General Ledger), แผนจัดสรรงบประมาณรายคณะ, การกระทบยอดเงินรับค่าเทอม (Payment Reconciliation) พร้อม Export CSV
* **Advanced AI/ML Analytics Center**: [http://localhost:3001/ai-analytics](http://localhost:3001/ai-analytics) — โมเดลพยากรณ์ความเสี่ยงนักศึกษาออกกลางคัน (ความแม่นยำ 92.4%), AI แนะนำวิชาเลือกเสรี, Executive AI Natural Language Copilot
* **CHE / ONESQA Real-time Data Bridge**: [http://localhost:3001/integration](http://localhost:3001/integration) — ระบบ M2M Real-time API Pipelines เชื่อมต่อศูนย์ข้อมูล สกอ./อว. พร้อมระบบสร้างรายงานการประเมินตนเองตามตัวบ่งชี้ สมศ. (ONESQA SAR Generator)
* **Multi-institution Campus Switcher**: ตัวสลับวิทยาเขตบนแถบเมนูด้านบน (กรุงเทพฯ วิทยาเขตหลัก, ปราจีนบุรี, เชียงใหม่, และ Consolidated Network)

---

## 🏛️ สถาปัตยกรรมระบบ (System Architecture)

ระบบถูกสร้างขึ้นในรูปแบบ **Turborepo Monorepo** ขนาด 14 Workspaces สอดคล้องตามมาตรฐานความปลอดภัยระดับองค์กร:

```
├── apps/
│   ├── web/              # Next.js 14 Web Portal สำหรับนักศึกษาและอาจารย์ (Port 3000)
│   │   ├── /sis          # Core SIS: ลงทะเบียนเรียน, เกรด, คำร้อง, ตารางสอบ
│   │   ├── /documents    # e-Document: สารบรรณ, แฟ้มรอลงนาม, คลังเอกสาร
│   │   ├── /lms          # LMS: ห้องเรียนเสมือน, สื่อการสอน, ส่งการบ้าน, ควิซ
│   │   ├── /research     # Research: ยื่นขอทุน, งวดงาน, Scopus, จริยธรรม IRB
│   │   └── manifest.json # Progressive Web App (PWA) Mobile Manifest
│   ├── admin/            # Next.js 14 Admin Console สำหรับผู้บริหารและเจ้าหน้าที่ (Port 3001)
│   │   ├── /             # Executive Cockpit & Native Observability Metrics
│   │   ├── /users        # Identity & PDPA Governance, RBAC Matrix
│   │   ├── /approvals    # Workflow Review & Digital Signing Queue
│   │   ├── /finance      # ERP Finance & Budgeting, General Ledger, Reconciliation
│   │   ├── /ai-analytics # Advanced AI/ML Predictive Analytics, Dropout Risk AI
│   │   ├── /integration  # CHE / ONESQA Real-time Data Bridge & SAR Generator
│   │   └── Switcher      # Multi-institution Campus Switcher Component
│   └── api-gateway/      # Fastify Dynamic Reverse Proxy Router (Port 4000)
├── services/
│   ├── identity/         # Microservice: Auth, RBAC Matrix, PII Encryption (Port 4001)
│   ├── sis/              # Microservice: ทะเบียน, นักศึกษา, Atomic Seat Locking (Port 4002)
│   ├── document/         # Microservice: e-Document Workflow, Local Disk + SHA-256 (Port 4003)
│   ├── analytics/        # Microservice: KPI Metrics Engine, SLA Tracker (Port 4004)
│   └── notification/     # Microservice: Event-driven Messaging Queue (Port 4005)
├── packages/
│   ├── ui/               # Reusable UI Library (Tailwind CSS + Lucide Icons)
│   ├── types/            # Shared DTOs, Post-MVP Interfaces, TypeScript Definitions
│   ├── db/               # Prisma ORM Schema (16 Models) & Database Migrations
│   ├── utils/            # AES-256-GCM Cryptography, PII Masking, Thai Date Formatter
│   └── config/           # Shared ESLint, Prettier, TypeScript Configurations
└── docs/
    ├── screenshots/      # ภาพแคปหน้าจอ GUI แสดงผลจริงของระบบ
    └── gui-prototypes/   # ต้นแบบโค้ด HTML สำหรับแต่ละหน้าจอ
```

---

## 🚀 วิธีการติดตั้งและเปิดใช้งาน (Quick Start)

### ข้อกำหนดขั้นต่ำ
- **Node.js**: v20.x หรือสูงกว่า
- **pnpm**: v9.x หรือสูงกว่า
- **Docker & Docker Compose** (สำหรับ PostgreSQL 16 และ RabbitMQ)

### 1. โคลนคลังโค้ด (Clone Repository)
```bash
git clone https://github.com/vipmcu/College-Digital-Ecosystem.git
cd College-Digital-Ecosystem
```

### 2. ติดตั้ง Dependencies
```bash
pnpm install
```

### 3. เปิดบริการฐานข้อมูล (Start Database Containers)
```bash
docker compose up -d
```

### 4. สร้าง Schema และเตรียมข้อมูลจำลอง (Prisma & Seed Data)
```bash
pnpm --filter @repo/db exec prisma generate
pnpm --filter @repo/db exec prisma migrate deploy
pnpm run seed
```

### 5. เปิดรันระบบทั้งหมด (Start Full Monorepo)
```bash
pnpm turbo run dev
```

---

## 🌐 ไดเรกทอรีเส้นทางและบริการในระบบ (System Routes Directory)

| บริการ (Service / Portal) | Port | เส้นทาง (Route URL) | กลุ่มผู้ใช้งานหลัก | สถานะ |
|---|:---:|---|---|:---:|
| **Central Service Hub** | 3000 | [http://localhost:3000](http://localhost:3000) | ทุกกลุ่มผู้ใช้งาน | ✅ 200 OK |
| **Core SIS (ทะเบียน & ผลการเรียน)** | 3000 | [http://localhost:3000/sis](http://localhost:3000/sis) | นักศึกษา, งานทะเบียน | ✅ 200 OK |
| **e-Document (สารบรรณอิเล็กทรอนิกส์)** | 3000 | [http://localhost:3000/documents](http://localhost:3000/documents) | อาจารย์, บุคลากร | ✅ 200 OK |
| **LMS (ห้องเรียนเสมือนจริง)** *(Post-MVP)* | 3000 | [http://localhost:3000/lms](http://localhost:3000/lms) | นักศึกษา, อาจารย์ | ✅ 200 OK |
| **Research (บริหารงานวิจัย)** *(Post-MVP)* | 3000 | [http://localhost:3000/research](http://localhost:3000/research) | อาจารย์, นักวิจัย | ✅ 200 OK |
| **Executive Cockpit (แดชบอร์ด)** | 3001 | [http://localhost:3001](http://localhost:3001) | อธิการบดี, คณบดี, ผู้บริหาร | ✅ 200 OK |
| **Users & PDPA Governance** | 3001 | [http://localhost:3001/users](http://localhost:3001/users) | ผู้ดูแลระบบ, DPO | ✅ 200 OK |
| **Approval Queue (คิวอนุมัติ)** | 3001 | [http://localhost:3001/approvals](http://localhost:3001/approvals) | ผู้มีอำนาจลงนาม, ผู้บริหาร | ✅ 200 OK |
| **ERP Finance Dashboard** *(Post-MVP)* | 3001 | [http://localhost:3001/finance](http://localhost:3001/finance) | ผู้บริหาร, กองคลัง | ✅ 200 OK |
| **AI/ML Analytics Center** *(Post-MVP)* | 3001 | [http://localhost:3001/ai-analytics](http://localhost:3001/ai-analytics) | ผู้บริหาร, อาจารย์ที่ปรึกษา | ✅ 200 OK |
| **CHE/ONESQA Data Bridge** *(Post-MVP)* | 3001 | [http://localhost:3001/integration](http://localhost:3001/integration) | ฝ่ายประกันคุณภาพ, ผู้บริหาร | ✅ 200 OK |
| **API Gateway Router** | 4000 | [http://localhost:4000](http://localhost:4000) | Reverse Proxy Microservices | ✅ 200 OK |
| **Identity Service** | 4001 | `http://localhost:4001/api/v1/auth` | Fastify, AES-256, Audit Logger | ✅ 200 OK |
| **SIS Service** | 4002 | `http://localhost:4002/api/v1/sis` | Fastify, Atomic Seat Locking | ✅ 200 OK |
| **Document Service** | 4003 | `http://localhost:4003/api/v1/documents` | Fastify, Local Disk + SHA-256 | ✅ 200 OK |
| **Analytics Service** | 4004 | `http://localhost:4004/api/v1/analytics` | Fastify, KPI Metrics Engine | ✅ 200 OK |
| **Notification Service** | 4005 | `http://localhost:4005/api/v1/notifications` | Fastify, Event Dispatcher | ✅ 200 OK |

---

## 🔑 บัญชีผู้ใช้สำหรับการทดสอบ (Demo Accounts)

| สิทธิ์การใช้งาน (Role) | ชื่อผู้ใช้งาน (Username) | รหัสผ่าน (Password) | สิทธิ์การเข้าถึง |
|---|---|---|---|
| **ผู้ดูแลระบบไอที (IT Admin)** | `admin` | `adminpassword` | เข้าถึง Admin Console และตั้งค่าระบบทั้งหมด |
| **อาจารย์ผู้สอน (Instructor)** | `instructor01` | `password123` | จัดการเกรด ตรวจสอบตารางสอน ลงนามคำร้อง |
| **นักศึกษา (Student)** | `student01` | `password123` | ลงทะเบียนเรียน ยื่นเอกสารคำร้องออนไลน์ |

---

## 🛡️ มาตรฐานความปลอดภัยและการคุ้มครองข้อมูลส่วนบุคคล (Security & PDPA)
* **Rule S-01**: ปราศจาก Hardcoded Secrets 100%
* **Rule S-02**: ซ่อนข้อมูลอ่อนไหว (PII Masking) จากไฟล์ Log ทุกประเภท
* **Rule S-03**: ตรวจสอบสิทธิ์ (Authentication & RBAC Middleware) ทุก Protected Routes
* **Rule S-04**: ตรวจสอบ Schema ของ Request Payload ด้วย Zod ก่อนประมวลผล
* **Rule S-05**: บันทึก Audit Log ทุกครั้งที่มีการเรียกอ่านหรือเขียนข้อมูล PII

---

## 📄 ใบอนุญาต (License)
โครงการนี้พัฒนาภายใต้สัญญาอนุญาต **MIT License** — สงวนลิขสิทธิ์ พ.ศ. 2569
