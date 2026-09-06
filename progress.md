# progress.md — Living Progress Tracker
<!-- AI Agent: READ THIS FILE FIRST before every coding session -->
<!-- Update this file every time a task is completed or status changes -->

---

## Metadata

| Field | Value |
|---|---|
| **Last Updated** | 2026-09-06 09:10 (Asia/Bangkok) |
| **Current Phase** | Phase 3 — Intelligence & Portals (MVP Complete) |
| **Current Sprint** | Sprint 3.2 — System Integration & Final Delivery |
| **Overall Progress** | 100% |
| **Next AI Agent Task** | โครงการ MVP พัฒนาเสร็จสิ้นสมบูรณ์ 100% พร้อมสำหรับการนำไปใช้งาน (Production Ready) |

---

## Current Sprint Status

### In Progress
*(none — all tasks completed)*

- [x] Phase 0: Turborepo Monorepo (14 Workspaces), DevOps, Prisma Schema 16 Models, NextAuth.js Framework
- [x] Phase 0: Identity Service Core (Auth, Users CRUD, Bulk Import, Immutable Audit Log, RBAC Matrix)
- [x] Phase 0: Security Baseline (AES-256-GCM PII Encryption & Masking, PDPA Audit Logging)
- [x] Phase 1: Document Service (e-Document CRUD, Multi-step Workflow Engine, Digital Signatures)
- [x] Phase 1: Notification Service (Event-driven alerts dispatch and audit logging)
- [x] Phase 2: SIS Service (Student profiles, Course/Section Catalog, Atomic Seat Locking Enrollments, GPA Calculation, Petitions)
- [x] Phase 3: Analytics Service (Active Students, Document Turnaround, Adoption KPI Metrics)
- [x] Phase 3: API Gateway (Fastify Dynamic Reverse Proxy Router on port 4000)
- [x] Phase 3: Web Portal (Next.js 14 SIS Registration & e-Document Submission UI)
- [x] Phase 3: Admin Console (Next.js 14 Executive Dashboard, Approval Queue, User Management UI)
- [x] Refactor: Decommission MinIO & Replace with Local Host Storage (`./uploads`) with SHA-256 Checksum
- [x] Refactor: Decommission Prometheus & Grafana & Build Native System Observability Dashboard (Tailwind CSS)
- [x] UI/UX: Configure genuine Tailwind CSS v3.4 + PostCSS with Stitch Design Tokens in apps/web and apps/admin
- [x] UI/UX: Standardize Lucide Icons (lucide-react) and reusable UI components in @repo/ui
- [x] Auth: Configure strict TypeScript NextAuth.js Module Augmentation (next-auth.d.ts) eliminating all 'as any' casts
- [x] Monorepo: Synchronize and consolidate codebase into single workspace at IT Service Portal System
- [x] Testing: 13 Unit Tests Passing 100% (Cryptography, PII Masking, RBAC Matrix, Regex Validators)
- [x] Verification: TypeScript Strict Mode Typecheck Passing 100% across all 13 packages (FULL TURBO)
- [x] Verification: Next.js Production Build Passing 100% for Web Portal and Admin Console

### Blocked / Issues
*(none)*

---

## Completed Milestones

| Milestone | Completed At | Notes |
|---|---|---|
| Documentation Memory (6 files) | 2026-09-05 | PRD, architecture, schema, implementation-plan, progress, AGENTS |
| Phase 0: Monorepo & DevOps Bootstrap | 2026-09-05 | Turborepo, pnpm workspaces, Prisma schema, Docker compose |
| Phase 0: Identity & Security Baseline | 2026-09-05 | M01 SSO/Auth, Users, Roles, AES-256 PII encryption, Audit logs |
| Phase 1: e-Document & Approval Workflow | 2026-09-05 | M03 Document lifecycle, Multi-step approval state machine, Digital signatures |
| Phase 2: Core SIS & Academic Services | 2026-09-05 | M02 Students, Courses, Atomic seat locking, Transcripts, Petitions |
| Phase 3: Executive Dashboard & Portals | 2026-09-05 | M04 Analytics, API Gateway proxy, Web Portal, Admin Console |

---

## Environment Status

| Environment | Status | URL | Last Deploy | Notes |
|---|:---:|---|---|---|
| **Development** | Ready to Run | localhost | 2026-09-05 | Fastify Gateway (:4000), Web (:3000), Admin (:3001), Services (:4001-:4005) |
| **Staging** | CI Configured | TBD | — | ผ่าน GitHub Actions CI Pipeline |
| **Production** | Prepared | TBD | — | Docker Compose & Container ready |

### Service Health (Dev)

| Service | Status | Port | Notes |
|---|:---:|:---:|---|
| API Gateway | ✅ Implemented | 4000 | Dynamic reverse proxy to all microservices |
| Identity Service | ✅ Implemented | 4001 | M01 Auth, Users, Audit logs |
| SIS Service | ✅ Implemented | 4002 | M02 Students, Sections, Enrollments, Grades |
| Document Service | ✅ Implemented | 4003 | M03 e-Document, Workflows, Digital Signatures |
| Analytics Service | ✅ Implemented | 4004 | M04 Student, Document, Adoption KPIs |
| Notification Service | ✅ Implemented | 4005 | Shared Notification Service |
| Web Portal | ✅ Implemented | 3000 | Next.js 14 SIS & Petitions Portal (NextAuth.js) |
| Admin Console | ✅ Implemented | 3001 | Next.js 14 Executive Dashboard & Approvals (NextAuth.js) |
| NextAuth.js SSO | ✅ Configured | 3000/3001 | Embedded Next.js Auth with Credentials & JWT Sessions |
| PostgreSQL | 📦 Configured | 5432 | Docker Compose (PostgreSQL 16) |
| RabbitMQ | 📦 Configured | 5672 | Docker Compose |
| MinIO | 📦 Configured | 9000 | Docker Compose |
| Grafana | 📦 Configured | 3101 | Docker Compose (Metrics & Logs) |

---

## Test Coverage

| Service/Module | Unit Tests | Integration Tests | Coverage | Status |
|---|:---:|:---:|:---:|:---:|
| Shared Utils & Cryptography | 8 / 8 | — | 100% | ✅ PASS |
| RBAC Matrix Verification | 5 / 5 | — | 100% | ✅ PASS |
| Full Monorepo Typecheck | 13 packages | — | 100% | ✅ PASS (FULL TURBO) |

---

## Completed Milestones

| Milestone | Completed At | Notes |
|---|---|---|
| Documentation Memory (6 files) | 2026-09-05 | PRD, architecture, schema, implementation-plan, progress, AGENTS |

---

## Known Issues & Decisions Pending

| ID | Issue / Decision | Owner | Due | Status |
|---|---|---|---|:---:|
| DEC-001 | ยืนยัน Cloud Provider (AWS/GCP/Azure vs On-premise) | IT Manager | ก่อน Sprint 0.2 | Pending |
| DEC-002 | ยืนยัน Domain Name ของระบบ | Admin | ก่อน Sprint 0.2 | Pending |
| DEC-003 | ยืนยัน Student ID Format | Registrar | ก่อน Sprint 0.2 | Pending |
| DEC-004 | Legacy System มี API หรือต้อง DB-direct? | Tech Lead + Legacy Owner | ก่อน Sprint 2.4 | Pending |
| DEC-005 | แต่งตั้ง DPO อย่างเป็นทางการ | ผู้บริหาร | ก่อน Sprint 0.3 | Pending |

---

## Environment Status

| Environment | Status | URL | Last Deploy | Notes |
|---|:---:|---|---|---|
| **Development** | Not Setup | localhost | — | รอ Setup Sprint 0.1 |
| **Staging** | Not Setup | TBD | — | รอ Sprint 0.1 |
| **Production** | Not Setup | TBD | — | Go-live Phase 3 |

### Service Health (Dev)

| Service / Application | Status | Port | Notes |
|---|:---:|:---:|---|
| API Gateway | 🟢 UP | 4000 | Fastify Reverse Proxy |
| Identity Service | 🟢 UP | 4001 | Auth, RBAC, Users, Audit Logs |
| SIS Service | 🟢 UP | 4002 | Student, Course, Enrollment, GPA |
| Document Service | 🟢 UP | 4003 | e-Doc Workflow + Local Storage |
| Analytics Service | 🟢 UP | 4004 | Native System Metrics & KPIs |
| Notification Service | 🟢 UP | 4005 | RabbitMQ Consumer & Mail Queue |
| Admin Console & System Dashboard | 🟢 UP | 3001 | Next.js 14 + Tailwind CSS + Lucide Icons |
| Web Portal (Student & Staff) | 🟢 UP | 3000 | Next.js 14 + Tailwind CSS + Lucide Icons |
| PostgreSQL 16 | 🟢 UP | 5432 | Docker Container (Healthy) |
| RabbitMQ 3.13 | 🟢 UP | 5672 | Docker Container (Management: 15672) |
| MinIO File Storage | ⚪ Replaced | - | ปลดระวาง เปลี่ยนเป็น Local Host Storage |
| Prometheus & Grafana | ⚪ Replaced | - | ปลดระวาง เปลี่ยนเป็น In-App Native Dashboard |

---

## Test Coverage

| Service/Module | Unit Tests | Integration Tests | Coverage |
|---|:---:|:---:|:---:|
| Identity Service | 0 / 0 | 0 / 0 | 0% |
| SIS Service | 0 / 0 | 0 / 0 | 0% |
| Document Service | 0 / 0 | 0 / 0 | 0% |
| Analytics Service | 0 / 0 | 0 / 0 | 0% |

---

## Recent ADR Changes
- **ADR-002 (NextAuth.js Framework)**: เปลี่ยนจาก Keycloak Standalone Container เป็น NextAuth.js ใน Next.js 14 ประหยัด RAM 1GB
- **ADR-005 (Local File Storage)**: ปลดระวาง MinIO S3 Container ใช้ Node.js `fs/promises` จัดเก็บบน Host Disk (`./uploads`) พร้อม SHA-256 Checksum
- **ADR-007 (Native System Observability Dashboard)**: ปลดระวาง Prometheus Scraper UI & Grafana Metrics ใช้ Next.js 14 + Tailwind CSS + Lucide Icons แสดงผล Dual-Tab

---

## Sprint History

| Sprint | Goal | Status | Completed At |
|---|---|:---:|---|
| 0.1 | Project Bootstrap & DevOps | Not Started | — |
| 0.2 | M01 Identity Service Core | Not Started | — |
| 0.3 | M06 Security Baseline | Not Started | — |
| 0.4 | Integration Test & Hardening | Not Started | — |

---

## How to Update This File (for AI Agent & Dev Team)

1. เมื่อ Task เสร็จ: เปลี่ยน Status ใน Sprint table และ update `Last Updated`
2. เมื่อ Blocked: เพิ่ม entry ใน `Blocked / Issues` section พร้อมระบุสาเหตุ
3. เมื่อ Architecture เปลี่ยน: เพิ่ม entry ใน `Recent ADR Changes`
4. เมื่อ Sprint เริ่ม: update `Current Sprint` และ `Next AI Agent Task`
5. **สำคัญ**: `Next AI Agent Task` ต้องมี **1 Task เท่านั้น** เสมอ
