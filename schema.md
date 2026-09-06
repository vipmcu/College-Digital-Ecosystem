# schema.md — Data Schema & Domain Model
<!-- Version: 1.0.0 | Last Updated: 2026-09-05 | Owner: Backend Lead / DBA -->

---

## 1. Naming Conventions & Standards

| Category | Convention | Example |
|---|---|---|
| Table Names | snake_case, plural | `users`, `course_sections` |
| Column Names | snake_case, singular | `student_id`, `created_at` |
| Primary Key | `id` (UUID v4) | `id UUID DEFAULT gen_random_uuid()` |
| Foreign Key | `{table_singular}_id` | `user_id`, `course_id` |
| Soft Delete | `deleted_at TIMESTAMPTZ` | NULL = active, NOT NULL = deleted |
| Audit Columns | `created_at`, `updated_at`, `created_by`, `updated_by` | ทุก Table |
| PII Fields | prefix `pii_` | `pii_national_id`, `pii_phone` |
| Encrypted PII | prefix `enc_` | `enc_national_id` |
| Timestamps | TIMESTAMPTZ (UTC) | แสดงผลเป็น Asia/Bangkok เมื่อ render |
| Academic Year | INTEGER (Buddhist Era) | `2568` |
| Semester | SMALLINT | 1, 2, 3 (Summer) |

### Student ID Format
```
Format: YYYYNNNNNN
Example: 2025000001 (ปีเข้า ค.ศ. + ลำดับ 6 หลัก)
Constraint: CHECK (student_code ~ '\^[0-9]{10}$')
```

### Course ID Format
```
Format: DEPT-NNN-NNN
Example: CS-101-001 (Department + Course Number + Section)
```

---

## 2. Standard Columns (ทุก Table ต้องมี)

```sql
id          UUID        PRIMARY KEY DEFAULT gen_random_uuid()
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
deleted_at  TIMESTAMPTZ             -- Soft Delete: NULL = active
created_by  UUID        REFERENCES users(id) ON DELETE SET NULL
updated_by  UUID        REFERENCES users(id) ON DELETE SET NULL
```

---

## 3. Core Schemas

### 3.1 Identity Domain (M01)

#### Table: `organizations`
```sql
CREATE TABLE organizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(20)  NOT NULL UNIQUE,  -- e.g. "COLLEGE-001"
  name_th         VARCHAR(255) NOT NULL,
  name_en         VARCHAR(255),
  org_type        VARCHAR(50)  NOT NULL,  -- college | faculty | department | unit
  parent_id       UUID REFERENCES organizations(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  -- Standard columns
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
CREATE INDEX idx_organizations_parent_id ON organizations(parent_id);
CREATE INDEX idx_organizations_org_type  ON organizations(org_type);
```

#### Table: `users`
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keycloak_id     VARCHAR(255) UNIQUE,  -- Optional Keycloak / External OIDC ID
  password_hash   VARCHAR(255),         -- Hashed password for NextAuth.js
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  first_name_th   VARCHAR(100) NOT NULL,
  last_name_th    VARCHAR(100) NOT NULL,
  first_name_en   VARCHAR(100),
  last_name_en    VARCHAR(100),
  user_type       VARCHAR(20)  NOT NULL,  -- student | staff | instructor | admin
  org_unit_id     UUID REFERENCES organizations(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  -- Standard columns
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
-- Indexes
CREATE INDEX idx_users_keycloak_id  ON users(keycloak_id);
CREATE INDEX idx_users_username     ON users(username);
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_user_type    ON users(user_type);
CREATE INDEX idx_users_org_unit_id  ON users(org_unit_id);
```

#### Table: `roles`
```sql
CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(50)  NOT NULL UNIQUE,  -- student, instructor, registrar, ...
  name_th     VARCHAR(100) NOT NULL,
  name_en     VARCHAR(100),
  description TEXT,
  is_system   BOOLEAN NOT NULL DEFAULT FALSE, -- System roles cannot be deleted
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ,
  created_by  UUID,
  updated_by  UUID
);
```

#### Table: `user_roles`
```sql
CREATE TABLE user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  org_unit_id UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Role scoped to Org
  granted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,  -- NULL = no expiry
  granted_by  UUID REFERENCES users(id),
  UNIQUE(user_id, role_id, org_unit_id)
);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

#### Table: `audit_logs`
```sql
-- IMMUTABLE: INSERT ONLY, NO UPDATE, NO DELETE
CREATE TABLE audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_time    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id       UUID,  -- NULL if unauthenticated
  action        VARCHAR(100) NOT NULL,  -- LOGIN, LOGOUT, FAILED_LOGIN, PII_ACCESS, DATA_EXPORT
  resource_type VARCHAR(100),           -- users, students, documents
  resource_id   UUID,
  ip_address    INET NOT NULL,
  user_agent    TEXT,
  metadata      JSONB,  -- Additional context (NO PII in metadata)
  severity      VARCHAR(20) NOT NULL DEFAULT 'INFO'  -- INFO, WARNING, CRITICAL
);
-- Partition by month for performance
CREATE INDEX idx_audit_logs_event_time  ON audit_logs(event_time DESC);
CREATE INDEX idx_audit_logs_user_id     ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action      ON audit_logs(action);
```

---

### 3.2 Academic Domain (M02)

#### Table: `students` (PII-Heavy)
```sql
-- PDPA: This table contains PII. All access must be audit-logged.
CREATE TABLE students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
  student_code    VARCHAR(10)  NOT NULL UNIQUE,  -- YYYYNNNNNN format
  enrollment_year INTEGER NOT NULL,              -- Buddhist Era
  program_id      UUID REFERENCES programs(id),
  status          VARCHAR(20)  NOT NULL DEFAULT 'active',
  -- PII Fields (encrypted at application level)
  enc_national_id TEXT,    -- Encrypted Thai National ID
  enc_phone       TEXT,    -- Encrypted phone number
  pii_birth_date  DATE,    -- PII: Date of birth
  pii_address     TEXT,    -- PII: Home address
  -- Standard columns
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
COMMENT ON TABLE students IS 'PII Table: All access requires audit log. PDPA applies.';
CREATE INDEX idx_students_user_id       ON students(user_id);
CREATE INDEX idx_students_student_code  ON students(student_code);
CREATE INDEX idx_students_status        ON students(status);
```

#### Table: `programs`
```sql
CREATE TABLE programs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(20)  NOT NULL UNIQUE,
  name_th         VARCHAR(255) NOT NULL,
  name_en         VARCHAR(255),
  degree_level    VARCHAR(20)  NOT NULL,  -- diploma | bachelor | master | doctor
  credit_required INTEGER NOT NULL,
  org_unit_id     UUID REFERENCES organizations(id),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
```

#### Table: `courses`
```sql
CREATE TABLE courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(20)  NOT NULL,  -- CS-101
  name_th         VARCHAR(255) NOT NULL,
  name_en         VARCHAR(255),
  credit          SMALLINT NOT NULL,
  course_type     VARCHAR(20) NOT NULL,  -- lecture | lab | seminar
  org_unit_id     UUID REFERENCES organizations(id),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID,
  UNIQUE(code, org_unit_id)
);
```

#### Table: `course_sections`
```sql
CREATE TABLE course_sections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  section_number  VARCHAR(10) NOT NULL,  -- 001
  academic_year   INTEGER NOT NULL,      -- Buddhist Era e.g. 2568
  semester        SMALLINT NOT NULL,     -- 1, 2, 3
  instructor_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  max_students    INTEGER NOT NULL DEFAULT 40,
  enrolled_count  INTEGER NOT NULL DEFAULT 0,
  room            VARCHAR(50),
  schedule        JSONB,  -- [{day: "MON", start: "09:00", end: "12:00"}]
  status          VARCHAR(20) NOT NULL DEFAULT 'open',  -- open | closed | cancelled
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID,
  UNIQUE(course_id, section_number, academic_year, semester)
);
CREATE INDEX idx_sections_course_id ON course_sections(course_id);
CREATE INDEX idx_sections_year_sem  ON course_sections(academic_year, semester);
```

#### Table: `enrollments`
```sql
CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  section_id      UUID NOT NULL REFERENCES course_sections(id) ON DELETE RESTRICT,
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          VARCHAR(20) NOT NULL DEFAULT 'enrolled',  -- enrolled | withdrawn | completed
  grade           VARCHAR(5),   -- A, B+, B, C+, C, D+, D, F, W, I
  grade_point     DECIMAL(3,2), -- 4.00, 3.50, ...
  grade_approved_at TIMESTAMPTZ,
  grade_approved_by UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID,
  UNIQUE(student_id, section_id)
);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON enrollments(section_id);
```

#### Table: `petitions`
```sql
CREATE TABLE petitions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_type   VARCHAR(50)  NOT NULL,  -- leave_of_absence | withdrawal | document_request
  student_id      UUID NOT NULL REFERENCES students(id),
  subject         VARCHAR(255) NOT NULL,
  description     TEXT,
  status          VARCHAR(20)  NOT NULL DEFAULT 'pending',
  workflow_id     UUID REFERENCES workflows(id),  -- Links to M03
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
CREATE INDEX idx_petitions_student_id ON petitions(student_id);
CREATE INDEX idx_petitions_status     ON petitions(status);
```

---

### 3.3 Document Domain (M03)

#### Table: `document_types`
```sql
CREATE TABLE document_types (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50)  NOT NULL UNIQUE,
  name_th         VARCHAR(255) NOT NULL,
  name_en         VARCHAR(255),
  default_workflow_id UUID,  -- Default workflow for this type
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
```

#### Table: `documents`
```sql
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type_id UUID NOT NULL REFERENCES document_types(id),
  doc_number      VARCHAR(50),      -- เลขที่หนังสือ e.g. วท.001/2568
  subject         VARCHAR(500) NOT NULL,
  body            TEXT,
  status          VARCHAR(20) NOT NULL DEFAULT 'draft',
  -- draft | submitted | pending_approval | approved | rejected | archived
  file_path       TEXT,             -- Local Host Storage path (./uploads) with SHA-256 integrity check
  file_size_bytes BIGINT,
  mime_type       VARCHAR(100),
  created_by_user UUID NOT NULL REFERENCES users(id),
  org_unit_id     UUID REFERENCES organizations(id),
  submitted_at    TIMESTAMPTZ,
  archived_at     TIMESTAMPTZ,
  -- Full-text Search
  search_vector   TSVECTOR,  -- Updated by trigger
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
CREATE INDEX idx_documents_status        ON documents(status);
CREATE INDEX idx_documents_created_by    ON documents(created_by_user);
CREATE INDEX idx_documents_type          ON documents(document_type_id);
CREATE INDEX idx_documents_search_vector ON documents USING GIN(search_vector);
```

#### Table: `workflows`
```sql
CREATE TABLE workflows (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  document_id     UUID REFERENCES documents(id) ON DELETE CASCADE,
  current_step    INTEGER NOT NULL DEFAULT 1,
  total_steps     INTEGER NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID,
  updated_by      UUID
);
```

#### Table: `workflow_steps`
```sql
CREATE TABLE workflow_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id     UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  step_number     INTEGER NOT NULL,
  step_name       VARCHAR(255) NOT NULL,
  approver_id     UUID REFERENCES users(id),
  approver_role   VARCHAR(50),  -- Role-based approval (if approver_id is NULL)
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending | approved | rejected | skipped
  action_at       TIMESTAMPTZ,
  comment         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workflow_id, step_number)
);
CREATE INDEX idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX idx_workflow_steps_approver ON workflow_steps(approver_id);
```

#### Table: `digital_signatures`
```sql
CREATE TABLE digital_signatures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  signer_id       UUID NOT NULL REFERENCES users(id),
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  signature_type  VARCHAR(20) NOT NULL DEFAULT 'simple_electronic',
  signature_hash  TEXT NOT NULL,  -- SHA-256 hash of document at signing time
  ip_address      INET NOT NULL,
  metadata        JSONB  -- Browser fingerprint, OTP ref, etc.
);
CREATE INDEX idx_signatures_document ON digital_signatures(document_id);
```

---

### 3.4 Analytics Domain (M04)

Analytics Service ใช้ **Materialized Views** และ **Read Replicas** แทนการเพิ่ม Tables ใหม่ เพื่อไม่กระทบ Performance ของ Production DB

```sql
-- ตัวอย่าง Materialized View
CREATE MATERIALIZED VIEW mv_student_summary AS
SELECT
  o.code AS org_unit_code,
  o.name_th AS org_unit_name,
  COUNT(s.id) FILTER (WHERE s.status = 'active')   AS active_count,
  COUNT(s.id) FILTER (WHERE s.status = 'inactive') AS inactive_count,
  COUNT(s.id) AS total_count,
  DATE_TRUNC('month', NOW()) AS snapshot_month
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN organizations o ON u.org_unit_id = o.id
WHERE s.deleted_at IS NULL
GROUP BY o.code, o.name_th;

-- Refresh every 24 hours via pg_cron
SELECT cron.schedule('refresh-student-summary', '0 1 * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_student_summary');
```

---

## 4. PDPA-Sensitive Fields Registry

| Table | Column | Data Type | Sensitivity | Encryption | Retention |
|---|---|---|:---:|:---:|:---:|
| `students` | `enc_national_id` | TEXT | Critical | AES-256 | Life of enrollment + 5 yr |
| `students` | `enc_phone` | TEXT | High | AES-256 | Life of enrollment + 5 yr |
| `students` | `pii_birth_date` | DATE | High | None (hashed query) | Life of enrollment + 5 yr |
| `students` | `pii_address` | TEXT | Medium | None | Life of enrollment + 5 yr |
| `users` | `email` | VARCHAR | Medium | None (unique index) | While account active + 1 yr |
| `audit_logs` | `ip_address` | INET | Low | None | 3 years (PDPA) |
| `digital_signatures` | `ip_address` | INET | Low | None | Life of document + 3 yr |

> ⚠️ PDPA Rule: ห้าม SELECT PII Columns โดยไม่มีการ Audit Log ก่อนและหลัง

---

## 5. Data Retention Policy

| Table | Retention | Action After Expiry |
|---|---|---|
| `audit_logs` | 3 ปี | Archive to Cold Storage, ไม่ Delete |
| `students` (PII columns) | Life of enrollment + 5 ปี | Pseudonymize (NULL enc_* columns) |
| `documents` | 10 ปี (หนังสือราชการ) | Archive to MinIO Cold Tier |
| `users` | While active + 1 ปี | Soft delete, Anonymize PII |
| `enrollments` | Permanent | Archive only (ห้าม Delete) |
| `digital_signatures` | Life of document + 3 ปี | Archive |

---

## 6. Index Strategy

### Query Patterns ที่พบบ่อย

| Query | Table | Index |
|---|---|---|
| Login ด้วย username | `users` | `idx_users_username` |
| ค้นหา Student ด้วย student_code | `students` | `idx_students_student_code` |
| ดูตารางเรียนของนักศึกษา | `enrollments` JOIN `sections` | `idx_enrollments_student_id` |
| รายการ Document รอ Approve | `workflow_steps` | `idx_workflow_steps_approver` + status |
| Full-text ค้นหาเอกสาร | `documents` | `idx_documents_search_vector` (GIN) |
| Audit Log ตาม User | `audit_logs` | `idx_audit_logs_user_id` |

---

## 7. Migration Strategy

- **Tool**: Prisma Migrate (Dev) + SQL Migration Files (Prod)
- **Naming**: `YYYYMMDDHHMMSS_description.sql`
- **Rules**:
  - ✅ Always add columns as NULLABLE ก่อน แล้ว backfill แล้วค่อย add NOT NULL constraint
  - ✅ ใช้ CONCURRENTLY สำหรับ CREATE INDEX บน Table ใหญ่
  - ❌ ห้าม DROP COLUMN โดยตรง — ต้อง deprecate ก่อน 1 Sprint
  - ❌ ห้าม RENAME COLUMN โดยตรงใน Production — ต้องทำ phased migration
- **Rollback**: ทุก Migration ต้องมี rollback script คู่กัน

---

## 8. Legacy Data Mapping

| Legacy Field | Legacy Type | New Table | New Column | Transformation |
|---|---|---|---|---|
| `STD_CODE` | CHAR(10) | `students` | `student_code` | Trim + pad to 10 chars |
| `STD_NAME_TH` | NVARCHAR | `users` | `first_name_th` + `last_name_th` | Split by space |
| `STD_EMAIL` | VARCHAR | `users` | `email` | Lowercase + trim |
| `COURSE_CODE` | VARCHAR | `courses` | `code` | Map to new DEPT-NNN format |
| `ENROLL_YEAR` | INT (CE) | `students` | `enrollment_year` | Convert CE to BE (+543) |
| `GRADE` | VARCHAR | `enrollments` | `grade` | Normalize to standard scale |
| `DEPT_CODE` | VARCHAR | `organizations` | `code` | Map to new Org hierarchy |

---

## 9. Post-MVP Enterprise Extensions Domain Models & DTOs

สำหรับระบบส่วนขยายระดับองค์กรที่พัฒนาใน Phase 4 (Post-MVP) ได้กำหนดโครงสร้างข้อมูลร่วมใน `packages/types/src/post-mvp.dto.ts` ดังนี้:

### 9.1 LMS (Learning Management System) Models
- **`LmsCourse`**: `id`, `courseCode`, `courseNameTh`, `courseNameEn`, `instructorName`, `classroomUrl`, `progressPercentage`, `totalModules`, `completedModules`, `nextClassTime`, `bannerColor`
- **`CourseMaterial`**: `id`, `courseId`, `title`, `type ('video'|'pdf'|'slide'|'link')`, `sizeOrDuration`, `downloadUrl`, `updatedAt`
- **`Assignment`**: `id`, `courseId`, `courseCode`, `title`, `description`, `dueDate`, `maxScore`, `submittedScore`, `status ('PENDING'|'SUBMITTED'|'GRADED'|'OVERDUE')`, `submissionUrl`, `feedback`
- **`OnlineQuiz`**: `id`, `courseId`, `title`, `timeLimitMinutes`, `totalQuestions`, `status ('OPEN'|'COMPLETED'|'UPCOMING')`, `score`, `maxScore`

### 9.2 ERP Finance & Budgeting Models
- **`FinanceLedgerEntry`**: `id`, `entryNumber`, `timestamp`, `description`, `category ('TUITION_FEE'|'RESEARCH_GRANT'|'PROCUREMENT'|'SALARY'|'MAINTENANCE'|'OTHER')`, `type ('DEBIT'|'CREDIT')`, `amount`, `departmentCode`, `referenceDocId`, `status ('POSTED'|'PENDING'|'RECONCILED')`
- **`BudgetAllocation`**: `departmentCode`, `departmentName`, `fiscalYear`, `allocatedAmount`, `disbursedAmount`, `obligatedAmount`, `remainingAmount`, `executionRatePercent`
- **`PaymentReconciliation`**: `id`, `receiptNumber`, `studentCode`, `studentName`, `amount`, `paymentMethod ('PROMPTPAY'|'BILL_PAYMENT'|'BANK_TRANSFER')`, `transactionRef`, `paidAt`, `reconciled (BOOLEAN)`

### 9.3 Research & Publications Models
- **`GrantProposal`**: `id`, `projectTitle`, `principalInvestigator`, `faculty`, `grantType ('INTERNAL_SEED'|'NATIONAL_NRCT'|'INDUSTRY_JOINT')`, `budgetRequested`, `durationMonths`, `submissionDate`, `status ('SUBMITTED'|'UNDER_REVIEW'|'APPROVED'|'REVISION_REQUIRED')`
- **`ResearchProject`**: `id`, `code`, `title`, `leadResearcher`, `fundedAmount`, `currentMilestone`, `progressPercent`, `startDate`, `endDate`, `status ('ACTIVE'|'MILESTONE_DUE'|'COMPLETED')`
- **`PublicationRecord`**: `id`, `paperTitle`, `authors`, `journalName`, `indexing ('SCOPUS'|'TCI_TIER_1'|'TCI_TIER_2'|'WOS')`, `quartile ('Q1'|'Q2'|'Q3'|'Q4')`, `publicationYear`, `citationsCount`, `doiUrl`

### 9.4 Advanced AI/ML Models
- **`DropoutRiskPrediction`**: `studentId`, `studentCode`, `studentName`, `faculty`, `yearLevel`, `currentGpa`, `riskLevel ('LOW'|'MEDIUM'|'HIGH'|'CRITICAL')`, `riskScore (0-100)`, `riskFactors (ARRAY)`, `interventionRecommended`
- **`CourseRecommendation`**: `courseCode`, `courseName`, `credits`, `matchScore (0-100)`, `reasons (ARRAY)`, `prerequisiteMet (BOOLEAN)`
- **`AiCopilotQuery` / `AiCopilotResponse`**: `prompt`, `contextCampus`, `fiscalYear` ➔ `answer`, `confidence`, `generatedAt`, `suggestedFollowUps`, `supportingDataMetrics`

### 9.5 CHE / ONESQA Data Bridge Models
- **`MhesiSyncStatus`**: `serviceName`, `endpoint`, `lastSyncTimestamp`, `status ('HEALTHY'|'SYNCING'|'ERROR'|'OFFLINE')`, `recordsTransferred`, `validationErrorsCount`
- **`OnesqaSarIndicator`**: `indicatorCode`, `indicatorName`, `category`, `targetScore`, `actualScore`, `status ('EXCEEDED'|'MET'|'NEEDS_IMPROVEMENT')`, `lastAuditDate`

### 9.6 Multi-institution Campus Context
- **`CampusNode`**: `id`, `campusCode`, `nameTh`, `nameEn`, `isMainCampus (BOOLEAN)`, `activeStudents`, `activeStaff`, `establishedYear`
