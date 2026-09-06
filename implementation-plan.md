# implementation-plan.md — Sprint-Level Implementation Plan
<!-- Version: 1.0.0 | Last Updated: 2026-09-05 | Owner: Tech Lead / PM -->

---

## 1. Phase & Sprint Overview

| Phase | ช่วงเวลา | โมดูล | Goal |
|:---:|:---:|---|---|
| **Phase 0** | เดือน 1–2 | M01 + M06 | Foundation: Identity, Master Data, Security Baseline |
| **Phase 1** | เดือน 3–5 | M03 + M05 | Quick Win: e-Document + Change Management |
| **Phase 2** | เดือน 6–9 | M02 | Core Academic: SIS ครบวงจร |
| **Phase 3** | เดือน 10–12 | M04 | Intelligence: Executive Dashboard + UAT |

---

## 2. Phase 0 — Foundation (เดือน 1–2)

### Sprint 0.1 — Project Bootstrap & DevOps (สัปดาห์ 1–2)

**Goal**: ระบบ Dev Environment พร้อมใช้งาน ทุกคนใน Team Push Code ได้

| Task ID | Task | Owner | Effort | Depends On | Risk |
|---|---|---|:---:|---|:---:|
| T0.1.1 | สร้าง Turborepo Monorepo structure ตาม layout ใน architecture.md | Tech Lead | 1d | — | Low |
| T0.1.2 | ตั้งค่า ESLint + Prettier + TypeScript strict mode | Tech Lead | 0.5d | T0.1.1 | Low |
| T0.1.3 | Docker Compose: PostgreSQL, RabbitMQ, MinIO, Grafana, Loki, Prometheus | DevOps | 1d | T0.1.1 | Medium |
| T0.1.4 | GitHub Actions CI pipeline: Lint → Test → Build | DevOps | 1d | T0.1.1 | Low |
| T0.1.5 | ตั้งค่า Prisma + เชื่อม PostgreSQL | Backend Lead | 1d | T0.1.3 | Low |
| T0.1.6 | สร้าง `packages/types`, `packages/config`, `packages/utils` | Tech Lead | 1d | T0.1.1 | Low |
| T0.1.7 | ตั้งค่า Grafana + Loki + Prometheus | DevOps | 1d | T0.1.3 | Low |
| T0.1.8 | Staging environment provisioning | DevOps | 2d | T0.1.3 | High |

**Definition of Done**:
- [ ] `docker compose up` ขึ้น Environment ครบทุก Service โดยไม่ Error
- [ ] `turbo run build` ผ่านทุก Package
- [ ] GitHub Actions pipeline ผ่านบน PR แรก
- [ ] Grafana แสดง Metrics จาก PostgreSQL ได้

---

### Sprint 0.2 — M01 Identity Service & NextAuth.js (สัปดาห์ 3–4)

**Goal**: SSO & Authentication ทำงานได้ นักศึกษา/บุคลากร Login ผ่าน NextAuth.js และรับ JWT Session ได้

| Task ID | Task | Owner | Effort | Depends On | Risk |
|---|---|---|:---:|---|:---:|
| T0.2.1 | ติดตั้งและคอนฟิก NextAuth.js CredentialsProvider บน Next.js | Frontend/Backend | 1d | T0.1.1 | Low |
| T0.2.2 | Prisma Migration: `users`, `roles`, `user_roles`, `organizations` | Backend | 2d | T0.1.5 | Low |
| T0.2.3 | Identity Service: POST /auth/login, POST /auth/refresh, POST /auth/logout | Backend | 2d | T0.2.1, T0.2.2 | Low |
| T0.2.4 | Identity Service: GET/POST/PATCH /users CRUD | Backend | 2d | T0.2.2 | Low |
| T0.2.5 | RBAC Middleware สำหรับ API Gateway | Backend | 1d | T0.2.3 | Medium |
| T0.2.6 | Session Management & Role Payload ใน JWT สำหรับทุก Role | Fullstack | 1d | T0.2.1 | Low |
| T0.2.7 | Bulk Import User จาก CSV | Backend | 2d | T0.2.2 | Low |
| T0.2.8 | Unit Tests: Auth flows, RBAC permission checks | Backend | 1d | T0.2.3–T0.2.5 | Low |

**Definition of Done**:
- [ ] Login ด้วย username/password ผ่าน SSO ได้
- [ ] JWT Token ถูก Validate ที่ API Gateway
- [ ] RBAC ปฏิเสธ Request ที่ไม่มีสิทธิ์ (403)
- [ ] MFA บังคับสำหรับ Privileged Roles
- [ ] Unit Test Coverage >= 80% สำหรับ Identity Service

---

### Sprint 0.3 — M06 Security Baseline (สัปดาห์ 5–6)

**Goal**: Security ขั้นพื้นฐานครบ พร้อมสำหรับ PDPA Compliance

| Task ID | Task | Owner | Effort | Depends On | Risk |
|---|---|---|:---:|---|:---:|
| T0.3.1 | Prisma Migration: `audit_logs` (Append-only, Immutable) | Backend | 1d | T0.1.5 | Low |
| T0.3.2 | Audit Log Middleware: บันทึก Auth Events ทุกตัว | Backend | 1d | T0.3.1 | Low |
| T0.3.3 | PII Encryption utility (AES-256 via pgcrypto) | Backend | 2d | T0.1.5 | Medium |
| T0.3.4 | TLS configuration สำหรับทุก Service (Development certs) | DevOps | 1d | T0.1.3 | Low |
| T0.3.5 | Rate Limiter บน API Gateway (100 req/min per IP) | Backend | 1d | T0.1.3 | Low |
| T0.3.6 | Automated Daily Backup script + Retention policy 30 วัน | DevOps | 2d | T0.1.3 | Medium |
| T0.3.7 | Secret Management: ย้าย credentials ออกจาก .env ไป Vault/env secrets | DevOps | 1d | T0.1.3 | High |
| T0.3.8 | Security checklist review + document DR plan | Tech Lead | 1d | ทั้งหมด | Low |

**Definition of Done**:
- [ ] ทุก HTTP Request Redirect ไป HTTPS
- [ ] PII Fields encrypt/decrypt ได้ถูกต้อง
- [ ] Audit Log บันทึกทุก Auth Event แบบ Append-only
- [ ] Backup ทำงานอัตโนมัติและ Restore ได้จริง
- [ ] ไม่มี Hardcoded Secret ในโค้ดหรือ .env ที่ Commit

---

### Sprint 0.4 — Integration Test & Phase 0 Hardening (สัปดาห์ 7–8)

**Goal**: Phase 0 Stable พร้อมส่งมอบให้ Phase 1 ต่อได้

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T0.4.1 | Integration Tests: Login → JWT → Protected API flow | Backend | 2d |
| T0.4.2 | Load Test: Simulate 500 concurrent users on Auth endpoints | DevOps | 1d |
| T0.4.3 | Penetration Test เบื้องต้น (OWASP Top 10 checklist) | Tech Lead | 2d |
| T0.4.4 | Bug Fix และ Performance Tuning จาก Load Test | Backend | 2d |
| T0.4.5 | Documentation: API Spec (OpenAPI 3.1) สำหรับ M01 | Backend | 1d |

---

## 3. Phase 1 — Quick Win (เดือน 3–5)

### Sprint 1.1 — M03 Document Service Core (สัปดาห์ 9–10)

**Goal**: สร้างและส่งเอกสารอิเล็กทรอนิกส์ในองค์กรได้

| Task ID | Task | Owner | Effort | Risk |
|---|---|---|:---:|:---:|
| T1.1.1 | Prisma Migration: `documents`, `document_types` | Backend | 1d | Low |
| T1.1.2 | Document Service: CRUD Documents API | Backend | 3d | Low |
| T1.1.3 | Local Storage Service: Upload/Download เอกสารบน Host Disk พร้อม SHA-256 Checksum | Backend | 2d | Low |
| T1.1.4 | Full-text Search สำหรับเอกสาร (PostgreSQL tsvector) | Backend | 2d | Medium |
| T1.1.5 | Frontend: หน้า Create Document + Upload | Frontend | 3d | Low |
| T1.1.6 | Frontend: หน้า Document List + Search | Frontend | 2d | Low |

---

### Sprint 1.2 — M03 Approval Workflow Engine (สัปดาห์ 11–12)

**Goal**: Workflow อนุมัติหลายชั้นทำงานได้ พร้อม Real-time Status

| Task ID | Task | Owner | Effort | Risk |
|---|---|---|:---:|:---:|
| T1.2.1 | Prisma Migration: `workflows`, `workflow_steps` | Backend | 1d | Low |
| T1.2.2 | Workflow Engine: Auto-advance เมื่อ Approver อนุมัติ | Backend | 3d | High |
| T1.2.3 | RabbitMQ: Publish `approval.pending` events | Backend | 1d | Medium |
| T1.2.4 | Notification Service: Email แจ้งเตือนผู้อนุมัติ | Backend | 2d | Low |
| T1.2.5 | Frontend: หน้า Approval Queue สำหรับผู้อนุมัติ | Frontend | 3d | Low |
| T1.2.6 | Frontend: หน้าติดตามสถานะ Real-time | Frontend | 2d | Low |

---

### Sprint 1.3 — M03 Digital Signature + Export (สัปดาห์ 13–14)

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T1.3.1 | Prisma Migration: `digital_signatures` | Backend | 0.5d |
| T1.3.2 | Digital Signature: Hash document + บันทึก Signature record | Backend | 2d |
| T1.3.3 | PDF Export สำหรับเอกสาร (พร้อม Watermark) | Backend | 2d |
| T1.3.4 | Frontend: Signature UI component | Frontend | 2d |
| T1.3.5 | Integration Test: Full Workflow (Draft → Submit → Approve → Sign) | Backend | 2d |

---

### Sprint 1.4 — M05 Change Management Kickoff (สัปดาห์ 9–20 ต่อเนื่อง)

**Goal**: บุคลากรพร้อมใช้งานระบบ ลดแรงต้านก่อนเข้า Phase 2

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T1.4.1 | จัดทำ User Manual สำหรับ M01 (Login/SSO) และ M03 (e-Document) | PM + UX | 3d |
| T1.4.2 | คัดเลือกและ Onboard Champion Users แต่ละหน่วยงาน | PM | 2d |
| T1.4.3 | Training Session ครั้งที่ 1: Train-the-Trainer สำหรับ Champion Users | PM + Tech Lead | 2d |
| T1.4.4 | ตั้งค่า Helpdesk Channel (Line OA / Email) | PM | 1d |
| T1.4.5 | Survey ผู้ใช้งาน M03 ครั้งแรก (NPS + Feedback) | PM | 1d |

---

## 4. Phase 2 — Core SIS (เดือน 6–9)

### Sprint 2.1 — M02 Student & Program Management (สัปดาห์ 21–23)

| Task ID | Task | Owner | Effort | Risk |
|---|---|---|:---:|:---:|
| T2.1.1 | Prisma Migration: `students`, `programs`, `courses` | Backend | 2d | Low |
| T2.1.2 | Student Service: CRUD Students API + PII Encryption | Backend | 3d | Medium |
| T2.1.3 | Program & Course Management API | Backend | 2d | Low |
| T2.1.4 | Audit Log integration สำหรับทุก PII access | Backend | 1d | Low |
| T2.1.5 | Frontend: หน้าจัดการนักศึกษา (Registrar) | Frontend | 3d | Low |

---

### Sprint 2.2 — M02 Enrollment & Grade System (สัปดาห์ 24–26)

| Task ID | Task | Owner | Effort | Risk |
|---|---|---|:---:|:---:|
| T2.2.1 | Prisma Migration: `course_sections`, `enrollments` | Backend | 1d | Low |
| T2.2.2 | Enrollment API: Register/Withdraw with Seat Lock | Backend | 3d | High |
| T2.2.3 | Grade API: Submit/Approve/Publish grades | Backend | 2d | Medium |
| T2.2.4 | Frontend: หน้าลงทะเบียน (Student) | Frontend | 3d | Low |
| T2.2.5 | Frontend: หน้ากรอกเกรด (Instructor) | Frontend | 2d | Low |
| T2.2.6 | Concurrent enrollment protection (Optimistic Locking) | Backend | 2d | High |

---

### Sprint 2.3 — M02 Transcript & Petition (สัปดาห์ 27–28)

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T2.3.1 | Transcript generation API (PDF with Watermark) | Backend | 2d |
| T2.3.2 | Petition online API + เชื่อม M03 Workflow | Backend | 2d |
| T2.3.3 | Frontend: หน้า Student Dashboard (GPA, Credits, Schedule) | Frontend | 3d |
| T2.3.4 | Frontend: หน้ายื่นคำร้องออนไลน์ | Frontend | 2d |

---

### Sprint 2.4 — Data Migration & Parallel Run (สัปดาห์ 29–34)

**Goal**: ย้ายข้อมูล Legacy + ใช้งานระบบใหม่คู่ขนาน 1 เดือน ก่อน Cutover

| Task ID | Task | Owner | Effort | Risk |
|---|---|---|:---:|:---:|
| T2.4.1 | Data Profiling: วิเคราะห์คุณภาพข้อมูล Legacy | Backend + DBA | 3d | High |
| T2.4.2 | ETL Script: Extract + Transform จาก Legacy DB | Backend | 5d | High |
| T2.4.3 | Data Validation: ตรวจสอบความถูกต้องหลัง Migration | DBA | 3d | High |
| T2.4.4 | Parallel Run: ระบบใหม่-เก่าทำงานพร้อมกัน 4 สัปดาห์ | PM + Tech Lead | 20d | Medium |
| T2.4.5 | Rollback Drill: ทดสอบ Rollback procedure | DevOps | 2d | Medium |
| T2.4.6 | Cutover Plan & Communication | PM | 2d | Low |

---

## 5. Phase 3 — Executive Dashboard (เดือน 10–12)

### Sprint 3.1 — M04 Data Pipeline (สัปดาห์ 35–37)

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T3.1.1 | สร้าง Materialized Views: `mv_student_summary`, `mv_workflow_status` | DBA | 3d |
| T3.1.2 | pg_cron setup: Refresh Views ทุก 24 ชั่วโมง | DBA | 1d |
| T3.1.3 | Analytics Service API: /dashboard/students, /dashboard/documents | Backend | 3d |
| T3.1.4 | Export API: Excel/PDF generation | Backend | 2d |

---

### Sprint 3.2 — M04 Dashboard UI (สัปดาห์ 38–40)

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T3.2.1 | Admin Panel: Student Summary Dashboard | Frontend | 3d |
| T3.2.2 | Admin Panel: Document & Workflow Status Dashboard | Frontend | 2d |
| T3.2.3 | Admin Panel: System Adoption Rate Dashboard | Frontend | 2d |
| T3.2.4 | Chart components (Recharts/Chart.js) | Frontend | 2d |

---

### Sprint 3.3 — UAT & Go-live Preparation (สัปดาห์ 41–48)

| Task ID | Task | Owner | Effort |
|---|---|---|:---:|
| T3.3.1 | UAT Environment setup ด้วยข้อมูล Production-like | DevOps | 2d |
| T3.3.2 | UAT Session กับ User Representatives ทุกกลุ่ม | PM + Tech Lead | 5d |
| T3.3.3 | Bug Fix จาก UAT Feedback | Dev Team | 5d |
| T3.3.4 | Security Audit ครั้งสุดท้ายก่อน Go-live | External / Tech Lead | 3d |
| T3.3.5 | PDPA Audit & Documentation | DPO + Tech Lead | 3d |
| T3.3.6 | Go-live Runbook สำหรับทีม Operations | DevOps | 2d |
| T3.3.7 | Production Go-live (กลางวันทำการ) | All | 1d |
| T3.3.8 | Post Go-live Monitoring 2 สัปดาห์แรก | DevOps + Tech Lead | 10d |

---

## 6. Definition of Done (DoD)

### API Endpoint DoD
- [ ] OpenAPI 3.1 Spec อัปเดตแล้ว
- [ ] Unit Tests Coverage >= 80%
- [ ] Integration Test ผ่าน
- [ ] Error Response format สม่ำเสมอ `{ error: string, code: string }`
- [ ] Audit Log สำหรับ PII endpoints
- [ ] Rate Limiting ครอบคลุม

### Frontend Component DoD
- [ ] Responsive (375px – 1920px)
- [ ] ผ่าน WCAG 2.1 AA (Lighthouse Score >= 90)
- [ ] Loading State และ Error State ครบ
- [ ] ไม่มี Console Error ใน Browser

### Database Migration DoD
- [ ] Migration Script ทดสอบบน Staging ก่อน
- [ ] Rollback Script พร้อม
- [ ] Index ที่จำเป็นถูกเพิ่มแล้ว
- [ ] COMMENT ON TABLE/COLUMN สำหรับ PII tables

---

## 7. Technical Debt Log

| ID | รายการ | Sprint ที่เกิด | Priority | Target Fix Sprint |
|---|---|:---:|:---:|:---:|
| TD-001 | Analytics ยังดึงจาก Primary DB ไม่ใช่ Read Replica | 3.1 | Medium | Post-MVP |
| TD-002 | Notification Service ยังไม่รองรับ SMS | 1.3 | Low | Post-MVP |
| TD-003 | ETL Script ยังเป็น Manual trigger ยังไม่ Automated | 2.4 | Medium | Post-MVP |
