# Architecture Blueprint — College Digital Ecosystem MVP
<!-- Version: 1.0.0 | Last Updated: 2026-09-05 | Owner: Architect / Tech Lead -->

---

## 1. Architecture Decision Records (ADR Summary)

| ADR | Decision | Context | Consequences |
|:---:|---|---|---|
| ADR-001 | **Turborepo Monorepo** | หลาย Service/App ต้องแชร์ Types, UI, และ DB Schema | + Code sharing, + Unified CI; - CI ช้าลงเมื่อ Repo ใหญ่ขึ้น |
| ADR-002 | **NextAuth.js (Auth.js) เป็น Authentication Framework** | ต้องการโซลูชันน้ำหนักเบา ฝังตัวใน Next.js โดยตรง รองรับ Credentials และ JWT Session จัดการผู้ใช้ผ่าน PostgreSQL/Prisma โดยตรง | + ไร้ค่าใช้จ่าย Resource Container (~1GB RAM Saved), + TypeScript Native 100%, + Seamless Next.js Integration; - ต้องจัดการ User Admin UI เอง (ซึ่งมีใน M01 แล้ว) |
| ADR-003 | **PostgreSQL เป็น Primary DB** | ต้องการ JSON Support, Full-text Search ภาษาไทย, ACID Compliance | + Feature Rich, + OSS; - ต้องดูแล Tuning เอง |
| ADR-004 | **REST + OpenAPI 3.1** | ทีมคุ้นเคย REST, ต้องการ Auto-generate Client SDK และ API Docs | + Familiar, + Tooling ดี; - Verbose กว่า GraphQL |
| ADR-005 | **Local File Storage (`fs/promises`)** | จัดเก็บไฟล์เอกสารบน Host Disk พร้อม SHA-256 Checksum ตรวจสอบความถูกต้อง แทน MinIO S3 Container | + ตัด Container Overhead ลด RAM, + ไม่มี S3 Dependency, + ควบคุม Data Residency บนโฮสต์ได้ 100%; - ต้องจัดการ Disk Backup เอง |
| ADR-006 | **Fastify เป็น Backend Framework** | ต้องการ Performance สูง (Low overhead), TypeScript Native | + เร็วกว่า Express 2-3x, + TypeScript; - Ecosystem เล็กกว่า Express |
| ADR-007 | **Native In-App Dashboard + Tailwind CSS + Lucide Icons** | สร้างหน้า Dashboard บริหารและวัดสถานะระบบใน Next.js (`apps/admin`) โดยตรง แทน Prometheus Scraper UI และ Grafana | + ลด RAM 1.5–2.5GB (ไม่ต้องรัน Prometheus/Grafana), + สวยงามกลมกลืนกับระบบวิทยาลัย, + ใช้ Lucide Icons ทั้งระบบ, + Dual-Tab สลับ KPIs และ Observability ได้ในหน้าเดียว; - เก็บ Time-series ละเอียดได้น้อยกว่า TSDB เฉพาะทาง |
| ADR-008 | **Post-MVP Enterprise Extensions Architecture** | พัฒนาระบบ LMS, ERP Finance, Research Grants, Predictive AI, CHE/ONESQA Data Bridge และ Multi-institution Switcher ภายใน Monorepo | + เชื่อมต่อกับ NextAuth.js และ Master Data ไร้รอยต่อ, + ไม่ต้องเพิ่ม Third-party Platform ภายนอก, + ขยาย DTOs ใน `@repo/types` แบบ Type-safe 100%; - ต้องดูแลขอบเขตการทดสอบเพิ่มขึ้น |

---

## 2. High-Level System Diagram (C4 — Context Level)

```
[นักศึกษา/บุคลากร] ──► [College Digital Ecosystem]
                                    │
              ┌─────────────────────┼──────────────────────┐
              ▼                     ▼                      ▼
       [NextAuth.js SSO]     [Local Storage]       [Email/SMS Gateway]
              │
    [Legacy Systems (ETL)]
```

### Actors
- **นักศึกษา**: ใช้ Web App (Responsive) ผ่าน Browser (ล็อกอินผ่าน NextAuth.js)
- **บุคลากร/อาจารย์**: ใช้ Web App + Admin Panel
- **ผู้บริหาร**: ใช้ Admin Panel (Dashboard)
- **IT Admin**: ใช้ Admin Panel จัดการผู้ใช้และสิทธิ์ RBAC
- **Legacy Systems**: ระบบเดิมที่ sync ข้อมูลผ่าน ETL Pipeline

---

### 3. Container Diagram (C4 — Container Level)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               College Digital Ecosystem                                │
│                                                                                        │
│  [Web App & PWA]                      [Admin Console & Executive Suite]                │
│  Next.js 14 — Port: 3000               Next.js 14 — Port: 3001                          │
│  Routes:                              Routes:                                          │
│  • / (Service Hub)                    • / (Executive Cockpit & Observability)          │
│  • /sis (Core SIS & Registration)     • /users (Identity & PDPA Governance)            │
│  • /documents (e-Document & Sign)     • /approvals (Review & Approval Queue)           │
│  • /lms (Digital Classrooms & Quiz)   • /finance (ERP Finance & General Ledger)        │
│  • /research (Grants & Publications)  • /ai-analytics (Predictive Dropout AI)          │
│  • manifest.json (Mobile PWA)         • /integration (CHE/ONESQA Data Bridge)          │
│       │                               • CampusSwitcher (Multi-institution Selector)    │
│       │                                    │                                           │
│       └───────────────────┬────────────────┘                                           │
│                           ▼                                                            │
│                    [API Gateway]                                                       │
│                    Fastify — Port: 4000                                                │
│                           │                                                            │
│    ┌──────────────┬───────┴──────┬──────────────┬──────────────┐                       │
│    ▼              ▼              ▼              ▼              ▼                       │
│ [Identity      [SIS           [Document      [Analytics     [Notification              │
│  Service]      Service]       Service]       Service]        Service]                  │
│  :4001         :4002          :4003          :4004           :4005                     │
│    │              │              │              │              │                       │
│    └──────────────┴──────────────┼──────────────┴──────────────┘                       │
│                                  │                                                     │
│                    [PostgreSQL 16]      [RabbitMQ 3.13]                                │
│                    Port: 5432           Port: 5672                                     │
│                                                                                        │
│  [Local Host Storage: ./uploads]         [Native Observability: Port 3001/4004]        │
│  SHA-256 Checksum Integrity              Latency, RAM RSS/Heap, System Health          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Module Boundary Map

### M01 — Identity Service (`services/identity/`)
- **Responsibility**: User Master Data, Credential Validation, RBAC, Audit Auth Log
- **Owns**: `users`, `roles`, `permissions`, `user_roles`, `organizations`, `org_units`, `audit_logs`
- **Exposes API**: `GET /api/v1/users`, `POST /api/v1/users`, `GET /api/v1/roles`, `POST /api/v1/auth/*`
- **Consumes**: NextAuth.js (Session & Token Exchange), RabbitMQ (User Events)
- **Depends On**: M06 (Security Policies)

### M02 — SIS Service (`services/sis/`)
- **Responsibility**: นักศึกษา หลักสูตร ลงทะเบียน เกรด คำร้อง
- **Owns**: `students`, `courses`, `course_sections`, `enrollments`, `grades`, `petitions`
- **Exposes API**: `GET /api/v1/students`, `POST /api/v1/enrollments`, `GET /api/v1/grades`
- **Consumes**: M01 (User Identity), M03 (Petition Workflow)
- **Depends On**: M01

### M03 — Document Service (`services/document/`)
- **Responsibility**: e-Document, Approval Workflow, Digital Signature
- **Owns**: `documents`, `workflows`, `workflow_steps`, `approvals`, `digital_signatures`
- **Exposes API**: `POST /api/v1/documents`, `GET /api/v1/workflows`, `POST /api/v1/approvals`
- **Consumes**: M01 (User/Role), Local File Storage (Disk & SHA-256), RabbitMQ (Notifications)
- **Depends On**: M01

### M04 — Analytics Service (`services/analytics/`)
- **Responsibility**: Read-only Dashboard, Materialized Views, Export
- **Owns**: Materialized Views, Report Configs (Read from M01–M03 DBs)
- **Exposes API**: `GET /api/v1/dashboard/*`, `GET /api/v1/reports/*`
- **Consumes**: M01, M02, M03 (Read Replicas หรือ Event Stream)
- **Depends On**: M01, M02, M03

### M06 — Security Layer (Cross-cutting)
- **Responsibility**: Security Policies, PDPA Enforcement, Audit Logging
- **ไม่ใช่ Service แยก** — เป็น Middleware/Policy ที่ inject เข้าทุก Service
- **Components**: JWT Validation Middleware, PII Masking, Rate Limiter, Audit Log Writer

### M07 — ERP Finance & Budgeting (`apps/admin/src/app/finance/`)
- **Responsibility**: บัญชีแยกประเภท (General Ledger), แผนงบประมาณรายคณะ, การกระทบยอดเงินรับค่าเทอม
- **Owns**: `FinanceLedgerEntry`, `BudgetAllocation`, `PaymentReconciliation` (DTOs)
- **Exposes**: Real-time Budget Metrics, Reconciliation Audit, CSV Ledger Export
- **Depends On**: M01, M02 (Tuition payment records)

### M08 — Learning Management System (`apps/web/src/app/lms/`)
- **Responsibility**: ห้องเรียนออนไลน์เสมือนจริง, คลังสื่อการสอน, กล่องส่งการบ้าน และศูนย์ข้อสอบออนไลน์
- **Owns**: `LmsCourse`, `CourseMaterial`, `Assignment`, `OnlineQuiz` (DTOs)
- **Exposes**: Course Progress, Due Date Countdown, SHA-256 Checksum Verification, Instant Quiz Grading
- **Depends On**: M01, M02 (Enrolled Courses & Sections)

### M09 — Research & Publications Portal (`apps/web/src/app/research/`)
- **Responsibility**: ยื่นขอทุนอุดหนุนวิจัย, ติดตามงวดงาน, คลังผลงานตีพิมพ์ Scopus/TCI, รับรองจริยธรรม IRB
- **Owns**: `GrantProposal`, `ResearchProject`, `PublicationRecord`, `EthicsReview` (DTOs)
- **Exposes**: Grant Workflow Submission, Milestone Tracker, Citations Stats, COA Certificate Download
- **Depends On**: M01, M03 (e-Document Review)

### M10 — Advanced AI/ML Analytics Center (`apps/admin/src/app/ai-analytics/`)
- **Responsibility**: โมเดลทำนายความเสี่ยงการตกออก (Dropout Risk AI), AI แนะนำวิชาเลือก, Executive Copilot
- **Owns**: `DropoutRiskPrediction`, `CourseRecommendation`, `AiCopilotQuery/Response` (DTOs)
- **Exposes**: XGBoost Risk Scores (92.4% Accuracy), Early Intervention Alerts, Natural Language Chat
- **Depends On**: M01, M02, M04, M08

### M11 — CHE / ONESQA Real-time Data Bridge (`apps/admin/src/app/integration/`)
- **Responsibility**: M2M Data Pipeline เชื่อมต่อศูนย์ข้อมูลกระทรวง อว. (สกอ.) และระบบประเมินตนเอง สมศ. (SAR)
- **Owns**: `MhesiSyncStatus`, `OnesqaSarIndicator`, `DataBridgeAudit` (DTOs)
- **Exposes**: M2M Sync Triggers, JSON Payload Validator, Automated SAR Export
- **Depends On**: M01, M02, M04, M07, M09

### M12 — Multi-institution Network & Progressive Web App (`apps/admin` & `apps/web`)
- **Responsibility**: ระบบสลับวิทยาเขต (Campus Switcher) และรองรับการติดตั้งแอปพลิเคชันบนมือถือ (PWA)
- **Owns**: `CampusNode`, `CampusOption`, Web App Manifest (`manifest.json`)
- **Exposes**: Bangkok Main, Prachinburi East, Chiang Mai North, and Consolidated Network Contexts
- **Depends On**: M01 (RBAC Context)

---

## 5. Integration Architecture

### 5.1 API Gateway Pattern

```
Client ──► [API Gateway :4000]
                │
                ├── /api/v1/auth/*     ──► Identity Service
                ├── /api/v1/users/*    ──► Identity Service
                ├── /api/v1/students/* ──► SIS Service
                ├── /api/v1/courses/*  ──► SIS Service
                ├── /api/v1/documents/*──► Document Service
                └── /api/v1/dashboard/*──► Analytics Service
```

- **Rate Limiting**: 100 req/min per IP, 1000 req/min per Authenticated User
- **Request Logging**: ทุก Request บันทึก Method, Path, Status, Latency (ไม่บันทึก Body ที่มี PII)
- **CORS**: Allow Origin ตาม Environment (Dev: *, Prod: college.ac.th เท่านั้น)

### 5.2 Event Bus (RabbitMQ)

| Exchange | Routing Key | Publisher | Consumer | Use Case |
|---|---|---|---|---|
| `user.events` | `user.created` | Identity | SIS, Document | สร้าง Student/Staff Record อัตโนมัติ |
| `user.events` | `user.updated` | Identity | SIS, Document | Sync ข้อมูลเมื่อ Master Data เปลี่ยน |
| `document.events` | `approval.pending` | Document | Notification | แจ้งเตือนผู้อนุมัติ |
| `document.events` | `approval.completed` | Document | SIS | Update สถานะคำร้อง |

### 5.3 Legacy System Integration (ETL)

- **Strategy**: ETL Pull — ดึงข้อมูลจาก Legacy DB ผ่าน Read-only Connection
- **Schedule**: รายคืน 02:00 น. (ช่วงที่ Load ต่ำที่สุด)
- **Tool**: Custom ETL Script (Node.js) ใน `scripts/etl/`
- **Flow**: Legacy DB → Extract → Transform (Map to New Schema) → Validate → Load → Audit Log
- **Error Handling**: Record ที่ Fail ต้อง Log และ Skip โดยไม่หยุด Batch ทั้งหมด

---

## 6. Deployment Architecture

### 6.1 Environment Strategy

| Environment | Purpose | Update Trigger | Data |
|---|---|---|---|
| **Development** | Local Dev | ทุก Commit | Mock/Seed Data |
| **Staging** | UAT / Integration Test | Merge to `main` | Anonymized Copy of Prod |
| **Production** | Live System | Manual Deploy หลัง Approval | Real Data |

### 6.2 Infrastructure (Hybrid Recommended)

```
┌─── On-Premise (Data Residency) ─────────────────────────┐
│  PostgreSQL (Primary + Replica)                          │
│  MinIO (File Storage)                                    │
│  RabbitMQ (Message Queue)                                │
└──────────────────────────────────────────────────────────┘

┌─── Cloud or On-Premise Kubernetes ──────────────────────┐
│  Next.js Apps with NextAuth.js (Web, Admin)              │
│  API Gateway, Services (Identity, SIS, Document, Analytics)│
│  Grafana + Loki + Prometheus                             │
└──────────────────────────────────────────────────────────┘
```

### 6.3 CI/CD Pipeline (GitHub Actions)

```
Push/PR ──► Lint + Type Check ──► Unit Tests ──► Build
                                                    │
                              ┌─────────────────────┤
                              ▼                     ▼
                         [main branch]         [PR branch]
                              │                     │
                         Deploy Staging        Preview Deploy
                              │
                    Manual Approval Gate
                              │
                         Deploy Prod
```

---

## 7. Security Architecture

### 7.1 Authentication Flow (NextAuth.js + JWT)

```
User ──► Next.js Login Page (Web / Admin)
              │
              ├── Credentials (username/email + password)
              ▼
    NextAuth.js API Route (/api/auth/[...nextauth])
              │
              ├── Verify against Identity Service (:4001) / DB
              ▼
       Issue Signed JWT Session Token
       (Contains: sub, username, email, roles, userType)
              │
              ├── Client manages Session via useSession()
              ▼
   Request with Bearer JWT ──► API Gateway (:4000)
                                      │
                            Validate JWT Signature
                                      │
                            Check RBAC Permission
                                      │
                            Route to Target Service
```

### 7.2 RBAC Matrix (Permission Summary)

| Resource | student | instructor | registrar | document_officer | executive | it_admin | dpo |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Own Profile | R/W | R/W | R/W | R/W | R/W | R/W/D | R |
| Student Records | Own | Advisee | All | - | Read | All | Audit |
| Courses | Read | Own | All | - | Read | All | - |
| Enrollments | Own | Read | All | - | Read | All | - |
| Grades | Read Own | Own + Approve | All | - | Read | All | - |
| Documents | Own | Own + Approve | Own | All | All + Approve | All | Audit |
| Dashboard | - | - | - | - | All | All | Audit |
| System Config | - | - | - | - | Read | All | - |
| Audit Logs | - | - | - | - | Summary | Read | All |

*R=Read, W=Write, D=Delete, Own=เฉพาะของตนเอง*

### 7.3 Data Encryption Strategy

| Level | Method | Applied To |
|---|---|---|
| At Rest (PII Fields) | AES-256 via pgcrypto | Columns ที่ marked `pii_*` |
| At Rest (Files) | MinIO Server-side Encryption | เอกสารทุกไฟล์ |
| In Transit | TLS 1.2+ | ทุก HTTP Communication |
| Secrets | Environment Variables จาก Secret Manager | Database Password, API Keys |

### 7.4 Audit Log Architecture

- **Immutable**: Audit Log เขียนได้อย่างเดียว ลบไม่ได้ (Append-only Table)
- **Events ที่บันทึก**: Login, Logout, Failed Login, PII Access, Data Export, Config Change
- **Retention**: 3 ปี (ตาม PDPA Guideline)
- **Format**: `{ timestamp, user_id, action, resource_type, resource_id, ip_address, user_agent }`

---

## 8. Observability Stack (Native In-App Observability)

| Component | Tool / Mechanism | Port | Purpose |
|---|---|:---:|---|
| Metrics Endpoint | Fastify (`/api/v1/analytics/system-metrics`) | 4004 | รวม Latency, RAM Heap/RSS, Table Counts, Healthcheck |
| Visualization UI | Next.js 14 + Tailwind CSS (`apps/admin`) | 3001 | In-App Executive KPIs & System Health Monitor |
| Iconography | Lucide Icons (`lucide-react`) | - | ไอคอนมาตรฐานเดียวกันทั้งระบบ |
| Database Metrics | PostgreSQL 16 Table Counts | 5432 | นับจำนวนเรคคอร์ดสดของ Users, Students, Documents, Logs |
| Storage Audit | Local Storage Service (`SHA-256`) | - | ตรวจนับไฟล์แนบและความสมบูรณ์ของเอกสาร |
| Audit Trail | Immutable `audit_logs` (PostgreSQL) | 5432 | บันทึกความมั่นคงปลอดภัยและการเข้าถึง PII |

### Alerting Rules (ตัวอย่าง)

- API Error Rate > 5% ใน 5 นาที → Alert to Slack + PagerDuty
- Database Connection Pool > 80% → Warning Alert
- Disk Usage > 85% → Critical Alert
- Failed Login Attempts > 50 ใน 10 นาที จาก IP เดียว → Security Alert

---

## 9. Scalability & Resilience Patterns

| Pattern | Applied At | เหตุผล |
|---|---|---|
| **Horizontal Pod Autoscaling** | API Gateway, Services | รองรับ Peak Load ช่วงลงทะเบียน |
| **Database Read Replica** | PostgreSQL | Analytics Service อ่านจาก Replica |
| **Circuit Breaker** | Service-to-Service calls | ป้องกัน Cascade Failure |
| **Rate Limiting** | API Gateway | ป้องกัน Abuse และ DDoS |
| **Health Check Endpoints** | ทุก Service | Kubernetes Liveness + Readiness Probe |
| **Graceful Shutdown** | ทุก Service | ไม่ Drop Request ระหว่าง Redeploy |

---

## 10. Technology Stack (Finalized)

| Layer | Technology | Version | Notes |
|---|---|:---:|---|
| Frontend | Next.js | 14+ | App Router, TypeScript |
| Backend Framework | Fastify | 4+ | TypeScript, Low overhead |
| Language | TypeScript | 5+ | Strict mode enabled |
| Database | PostgreSQL | 16 | Primary DB |
| ORM | Prisma | 5+ | Type-safe, Migration management |
| Authentication / Session | NextAuth.js (Auth.js) | 4.24+ | TypeScript Native, Credentials & JWT Session |
| File Storage | Local Host Storage | Node fs/promises | จัดเก็บใน `./uploads` พร้อม SHA-256 Checksum |
| Message Queue | RabbitMQ | 3.13+ | Durable queues |
| Monorepo | Turborepo | 2+ | Task pipeline caching |
| Container | Docker + Compose | Latest | PostgreSQL 16 + RabbitMQ 3.13 เท่านั้น (Ultra-lightweight) |
| Orchestration | Kubernetes | 1.29+ | Staging/Prod |
| CI/CD | GitHub Actions | - | Automated pipeline |
| Styling & UI | Tailwind CSS + Lucide Icons | Latest | Responsive, สวยงาม, เข้ากับระบบวิทยาลัย |
| Monitoring & Dashboard | Native In-App Dashboard | Next.js + Fastify | Dual-Tab: Executive KPIs & System Observability |
