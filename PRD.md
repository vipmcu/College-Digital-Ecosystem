# PRD — College Digital Ecosystem MVP
<!-- Version: 1.0.0 | Last Updated: 2026-09-05 | Owner: Product Owner / Tech Lead -->

---

## 1. Executive Summary

โครงการนี้มีเป้าหมายสร้าง **ระบบนิเวศดิจิทัลวิทยาลัย (College Digital Ecosystem)** ในรูปแบบ MVP ระยะเวลา 12 เดือน เพื่อแก้ปัญหาหลัก 5 ด้านที่พบในสถาบันอุดมศึกษาไทย ได้แก่ Data Silo, โครงสร้างพื้นฐาน IT ไม่เพียงพอ, ความพร้อมบุคลากรด้านดิจิทัล, ธรรมาภิบาลข้อมูลและความปลอดภัย และกระบวนการเอกสาร Manual ที่ล่าช้า

ระบบประกอบด้วย 6 Module หลัก (M01–M06) พัฒนาแบบ Phased โดยใช้ Vibe Coding (AI-assisted development) บน Tech Stack: **Next.js + Fastify + PostgreSQL + NextAuth.js + Turborepo**

---

## 2. Problem Statement — Pain Points Traceability Matrix

| # | Pain Point | Module ที่แก้ | Severity |
|:---:|---|---|:---:|
| P01 | ข้อมูลกระจัดกระจาย ไม่เชื่อมโยงกัน (Data Silo) | M01, M02, M04 | Critical |
| P02 | โครงสร้างพื้นฐานดิจิทัลและ IT ไม่เพียงพอ | M01, M06 | High |
| P03 | Digital Literacy & Resistance to Change | M05 (non-software) | High |
| P04 | ธรรมาภิบาลข้อมูลและ Cybersecurity อ่อนแอ | M06, M01 | High |
| P05 | กระบวนการเอกสาร/อนุมัติแบบ Manual | M03 | Medium-High |

---

## 3. Goals & Success Metrics (KPIs)

| หมวด | KPI | เป้าหมาย | วิธีวัด |
|---|---|:---:|---|
| Adoption | % บุคลากรที่ใช้ระบบ e-Document | >= 70% | Active Users / Total Staff |
| Adoption | % นักศึกษาที่ใช้ SIS ออนไลน์ | >= 85% | Monthly Active Users |
| Efficiency | ลดเวลาอนุมัติเอกสารเฉลี่ย | >= 50% | Avg. Approval Time Before vs After |
| Data Quality | อัตราข้อมูลซ้ำซ้อนใน Master Data | <= 2% | Dedup Check รายเดือน |
| Security | Data Breach Incidents | 0 | Security Log Monitoring |
| Compliance | ผ่าน PDPA Audit | Pass | External Audit Report |
| Satisfaction | NPS ของผู้ใช้ระบบ | >= +20 | Quarterly Survey |

---

## 4. User Personas & Roles

| Persona | Role Code | ความต้องการหลัก | Module หลัก |
|---|---|---|---|
| นักศึกษา | `student` | ลงทะเบียน ดูเกรด ยื่นคำร้องออนไลน์ | M02 |
| อาจารย์ | `instructor` | กรอกเกรด อนุมัติคำร้องนักศึกษา | M02, M03 |
| เจ้าหน้าที่ทะเบียน | `registrar` | จัดการข้อมูลนักศึกษา หลักสูตร | M01, M02 |
| เจ้าหน้าที่สารบรรณ | `document_officer` | รับ-ส่งหนังสือ ติดตามสถานะ | M03 |
| ผู้บริหาร | `executive` | Dashboard ภาพรวม อนุมัติเอกสารสำคัญ | M04, M03 |
| IT Administrator | `it_admin` | จัดการ User, Permission, System Config | M01, M06 |
| Data Protection Officer | `dpo` | ตรวจสอบ Audit Log, PDPA Compliance | M06 |

---

## 5. Scope

### 5.1 In Scope (MVP — 12 เดือน) [เสร็จสมบูรณ์ 100%]

- **M01** Unified Master Data & Identity (SSO + ฐานข้อมูลกลาง)
- **M02** Core Student Information System (SIS)
- **M03** e-Document & Approval Workflow
- **M04** Executive Dashboard (ขั้นต้น)
- **M05** Change Management & Digital Skill Enablement (non-software)
- **M06** Security & Data Governance Baseline

### 5.2 Post-MVP Enterprise Extensions [เสร็จสมบูรณ์ 100%]

ส่วนขยายระดับองค์กรที่ได้รับการพัฒนาเพิ่มเติมเพื่อยกระดับสู่ระบบนิเวศการศึกษาสมบูรณ์แบบ:
- **M07** ระบบการเงิน บัญชีแยกประเภท และงบประมาณ (ERP Finance & Budgeting)
- **M08** ระบบห้องเรียนออนไลน์และคลังบทเรียน (Learning Management System — LMS)
- **M09** ระบบบริหารงานวิจัยและคลังผลงานตีพิมพ์ทางวิชาการ (Research & Publications)
- **M10** ศูนย์ปัญญาประดิษฐ์และวิเคราะห์ขั้นสูง (Advanced AI/ML Predictive Analytics & AI Copilot)
- **M11** ระบบเชื่อมโยงข้อมูล สกอ./สมศ. แบบ Real-time (CHE/ONESQA Real-time Data Bridge)
- **M12** ระบบสลับวิทยาเขตและสถาบันในเครือ (Multi-institution Network) พร้อม Mobile PWA

### 5.3 Long-Term Roadmap (Future Research & Hardware)

- ระบบ IoT Smart Classroom & Face Recognition Turnstiles
- การเผยแพร่ Mobile Native Binary บน Apple App Store และ Google Play Store
- การเชื่อมโยง Blockchained Micro-credentials ข้ามมหาวิทยาลัยระดับนานาชาติ

---

## 6. Functional Requirements per Module

### M01 — Unified Master Data & Identity

| ID | Requirement | Priority |
|---|---|:---:|
| M01-F01 | Single Sign-On (SSO) สำหรับทุก Module | Must Have |
| M01-F02 | Role-Based Access Control (RBAC) | Must Have |
| M01-F03 | Master Data ของ User (นักศึกษา/บุคลากร) | Must Have |
| M01-F04 | Audit Log ทุก Authentication Event | Must Have |
| M01-F05 | Multi-Factor Authentication (MFA) สำหรับ Admin/Executive | Must Have |
| M01-F06 | Self-service Password Reset | Should Have |
| M01-F07 | Bulk Import User จาก Excel/CSV | Should Have |

### M02 — Core SIS

| ID | Requirement | Priority |
|---|---|:---:|
| M02-F01 | ลงทะเบียนเรียนออนไลน์ | Must Have |
| M02-F02 | กรอกและประกาศเกรด | Must Have |
| M02-F03 | Transcript ออนไลน์ (ไม่เป็นทางการ) | Must Have |
| M02-F04 | คำร้องออนไลน์ (พักการเรียน/ลาออก/ขอเอกสาร) | Must Have |
| M02-F05 | ตารางเรียน/ตารางสอบออนไลน์ | Must Have |
| M02-F06 | ข้อมูลหลักสูตรและรายวิชา | Must Have |
| M02-F07 | Dashboard นักศึกษา (GPA, Credit สะสม) | Should Have |

### M03 — e-Document & Approval Workflow

| ID | Requirement | Priority |
|---|---|:---:|
| M03-F01 | รับ-ส่งหนังสือราชการอิเล็กทรอนิกส์ | Must Have |
| M03-F02 | Workflow อนุมัติแบบกำหนดเองได้ (>= 5 ชั้น) | Must Have |
| M03-F03 | ติดตามสถานะ Real-time | Must Have |
| M03-F04 | แจ้งเตือนอัตโนมัติ (Email / In-app) ภายใน 1 นาที | Must Have |
| M03-F05 | ลายเซ็นดิจิทัล (Simple Electronic Signature) | Must Have |
| M03-F06 | ค้นหาและ Archive เอกสาร ย้อนหลัง >= 5 ปี | Must Have |
| M03-F07 | Export เอกสารเป็น PDF | Should Have |
| M03-F08 | จัดเก็บไฟล์บน Local Host Storage พร้อม SHA-256 Checksum ตรวจสอบความสมบูรณ์ไฟล์ | Must Have |

### M04 — Executive Dashboard

| ID | Requirement | Priority |
|---|---|:---:|
| M04-F01 | Dashboard จำนวนนักศึกษา (Active/Inactive) | Must Have |
| M04-F02 | Dashboard สถานะคำร้องและเอกสาร | Must Have |
| M04-F03 | Dashboard Adoption Rate ของระบบ | Must Have |
| M04-F04 | Export รายงานเป็น Excel/PDF | Should Have |
| M04-F05 | Trend Analysis (3 เดือนย้อนหลัง) | Nice to Have |
| M04-F06 | Native System Observability Dashboard (Tailwind CSS + Lucide Icons) สลับดู Service Latency, RAM Heap/RSS, Database Table Counts แทน Prometheus/Grafana | Must Have |

### M06 — Security & Data Governance Baseline

| ID | Requirement | Priority |
|---|---|:---:|
| M06-F01 | MFA บังคับสำหรับ Admin/Executive/DPO | Must Have |
| M06-F02 | Encryption at Rest สำหรับ PII Fields (AES-256) | Must Have |
| M06-F03 | Encryption in Transit (TLS 1.2+) | Must Have |
| M06-F04 | Audit Log สำหรับการเข้าถึง PII (Immutable) | Must Have |
| M06-F05 | Automated Backup รายวัน Retention 30 วัน | Must Have |
| M06-F06 | Disaster Recovery: RTO <= 4h, RPO <= 24h | Must Have |
| M06-F07 | PDPA Consent Management พร้อม Timestamp | Must Have |
| M06-F08 | Vulnerability Scanning รายไตรมาส | Should Have |

### M07 — ERP Finance & Budgeting (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M07-F01 | แดชบอร์ดสรุปงบประมาณจัดสรรและอัตราการเบิกจ่ายสะสม (KPIs) | Must Have |
| M07-F02 | แผนจัดสรรงบประมาณและการใช้จ่ายจำแนกตามคณะ/หน่วยงาน | Must Have |
| M07-F03 | สมุดรายวันทั่วไป (General Ledger Journal) พร้อมส่งออก CSV | Must Have |
| M07-F04 | การตรวจสอบและกระทบยอดเงินรับค่าเทอมกับ Statement ธนาคาร (Reconciliation) | Must Have |

### M08 — Learning Management System (LMS) (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M08-F01 | ห้องเรียนเสมือนจริง (Virtual Classroom) พร้อมลิงก์ประชุมและความก้าวหน้า | Must Have |
| M08-F02 | คลังเอกสารประกอบการสอน สไลด์ PDF และวิดีโอย้อนหลัง | Must Have |
| M08-F03 | กล่องส่งการบ้าน (Assignment Dropbox) พร้อมตรวจสอบ Checksum SHA-256 | Must Have |
| M08-F04 | ศูนย์แบบทดสอบออนไลน์ (Online Quiz Center) พร้อมระบบตรวจคะแนนทันที | Must Have |

### M09 — Research & Academic Publications (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M09-F01 | แบบฟอร์มยื่นข้อเสนอโครงการวิจัยขอรับทุนสนับสนุน (Grant Proposal) | Must Have |
| M09-F02 | ติดตามงวดงานและรายงานความก้าวหน้าโครงการวิจัย (Milestone Tracking) | Must Have |
| M09-F03 | คลังผลงานตีพิมพ์ทางวิชาการ Scopus (Q1/Q2) และ TCI กลุ่ม 1 พร้อม Citation | Must Have |
| M09-F04 | การตรวจสอบและดาวน์โหลดใบรับรองจริยธรรมการวิจัยในมนุษย์ (IRB Certificate) | Must Have |

### M10 — Advanced AI/ML Intelligence Center (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M10-F01 | โมเดล Machine Learning ทำนายความเสี่ยงการตกออกของนักศึกษา (Dropout Risk) | Must Have |
| M10-F02 | AI Course Recommendation Engine แนะนำรายวิชาเลือกตามสมรรถนะ | Must Have |
| M10-F03 | Executive AI Copilot ผู้ช่วยถาม-ตอบข้อมูลเชิงยุทธศาสตร์ภาษาธรรมชาติ | Must Have |

### M11 — CHE / ONESQA Real-time Data Bridge (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M11-F01 | M2M Real-time API Pipelines เชื่อมต่อศูนย์ข้อมูลกระทรวง อว. (สกอ.) | Must Have |
| M11-F02 | JSON Payload Schema Validation ตามมาตรฐานโครงสร้าง อว. | Must Have |
| M11-F03 | ระบบประมวลผลและสร้างรายงานการประเมินตนเองตามเกณฑ์ สมศ. (ONESQA SAR) | Must Have |

### M12 — Multi-institution Network & Progressive Web App (Post-MVP Extension)

| ID | Requirement | Priority |
|---|---|:---:|
| M12-F01 | ระบบสลับวิทยาเขตและสถาบันในเครือ (Multi-institution Campus Switcher) | Must Have |
| M12-F02 | Progressive Web App (PWA) Manifest สำหรับติดตั้งใช้งานบนสมาร์ตโฟน | Must Have |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | ขอบเขต |
|---|:---:|---|
| Page Load Time (LCP) | < 2.5s | ทุก Page บน Connection 10 Mbps |
| API Response Time (p95) | < 500ms | ทุก Endpoint ยกเว้น Report Generation |
| Report Generation Time | < 10s | Export <= 10,000 rows |
| Concurrent Users | >= 500 | ช่วง Peak (ลงทะเบียน/ประกาศเกรด) |
| Database Query Time (p95) | < 100ms | ทุก Query ยกเว้น Analytics |

### 7.2 Security & PDPA

- ระบบต้องผ่าน PDPA Compliance Audit ภายใน 12 เดือน
- PII ทุกชิ้นต้อง Classified และมี Data Retention Policy
- Data Breach แจ้ง DPO ภายใน 1 ชั่วโมง และแจ้ง สคส. ภายใน 72 ชั่วโมง
- ห้าม Log PII ใน Application Log ทุกกรณี
- Session Timeout: General User 8h, Admin/Executive 30min

### 7.3 Availability & SLA

| Environment | Uptime Target | Maintenance Window |
|---|:---:|---|
| Production | >= 99.5% | อาทิตย์ 01:00–03:00 น. |
| Staging | >= 95% | ไม่กำหนด |
| Development | Best Effort | ไม่กำหนด |

### 7.4 Accessibility

- WCAG 2.1 Level AA
- รองรับภาษาไทยเต็มรูปแบบ (Font, Encoding, Date Format พ.ศ.)
- Responsive Design: min-width 375px
- Browser Support: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+

---

## 8. Constraints & Assumptions

### Constraints

- งบประมาณ MVP: 4,900,000 – 9,900,000 บาท (12 เดือน)
- ทีม Dev: <= 8 คน (รวม AI-assisted Vibe Coding)
- ปฏิบัติตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
- ปฏิบัติตาม พ.ร.บ.จัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560
- ข้อมูลต้องจัดเก็บภายในประเทศไทย (Data Residency)

### Assumptions

- สถาบันมีนักศึกษา 3,000–8,000 คน บุคลากร 200–500 คน
- Server Internet Connection >= 100 Mbps ที่เสถียร
- มีทีมผู้รับผิดชอบข้อมูล Legacy และ Migration
- ผู้บริหารระดับสูงสนับสนุนโครงการอย่างต่อเนื่อง
- มี DPO แต่งตั้งอย่างเป็นทางการก่อน Go-live

---

## 9. Glossary

| คำศัพท์ | ความหมาย |
|---|---|
| **Student ID** | รหัสนักศึกษา รูปแบบ `YYYYNNNNNN` (ปี ค.ศ. + เลขลำดับ 6 หลัก) |
| **Academic Year** | ปีการศึกษา รูปแบบ พ.ศ. เช่น `2568` |
| **Semester** | ภาคการศึกษา ค่า: `1`, `2`, `3` (Summer) |
| **Course ID** | รหัสวิชา รูปแบบ `DEPT-NNN-NNN` |
| **Org Unit** | หน่วยงาน/สาขาวิชา/คณะ ภายในโครงสร้างองค์กร |
| **PII** | Personally Identifiable Information — ข้อมูลส่วนบุคคลตาม PDPA |
| **DPO** | Data Protection Officer — เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล |
| **RBAC** | Role-Based Access Control |
| **SIS** | Student Information System |
| **SSO** | Single Sign-On |
| **OIDC** | OpenID Connect — Protocol สำหรับ SSO |
| **MVP** | Minimum Viable Product |
| **Vibe Coding** | การพัฒนาซอฟต์แวร์โดยใช้ AI Agent ช่วยเขียนโค้ด |
