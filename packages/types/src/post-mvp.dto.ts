/**
 * Post-MVP Enterprise Shared Types and DTOs
 * Supporting Phase 4 Extensions: LMS, Finance ERP, Research, AI/ML Analytics, CHE/ONESQA Integration, Multi-Campus
 */

// 1. LMS (Learning Management System)
export interface LmsCourse {
  id: string
  courseCode: string
  courseNameTh: string
  courseNameEn: string
  instructorName: string
  classroomUrl: string
  progressPercentage: number
  totalModules: number
  completedModules: number
  nextClassTime?: string
  bannerColor: string
}

export interface CourseMaterial {
  id: string
  courseId: string
  title: string
  type: 'video' | 'pdf' | 'slide' | 'link'
  fileSize?: string
  duration?: string
  downloadUrl: string
  updatedAt: string
}

export interface Assignment {
  id: string
  courseId: string
  courseCode: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  submittedScore?: number
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE'
  submissionUrl?: string
  feedback?: string
}

export interface OnlineQuiz {
  id: string
  courseId: string
  title: string
  timeLimitMinutes: number
  totalQuestions: number
  status: 'OPEN' | 'COMPLETED' | 'UPCOMING'
  score?: number
  maxScore: number
}

// 2. ERP Finance (General Ledger & Budgeting)
export type LedgerEntryType = 'DEBIT' | 'CREDIT'
export type LedgerCategory = 'TUITION_FEE' | 'RESEARCH_GRANT' | 'PROCUREMENT' | 'SALARY' | 'MAINTENANCE' | 'OTHER'

export interface FinanceLedgerEntry {
  id: string
  entryNumber: string
  timestamp: string
  description: string
  category: LedgerCategory
  type: LedgerEntryType
  amount: number
  departmentCode: string
  referenceDocId?: string
  status: 'POSTED' | 'PENDING' | 'RECONCILED'
}

export interface BudgetAllocation {
  departmentCode: string
  departmentName: string
  fiscalYear: number
  allocatedAmount: number
  disbursedAmount: number
  obligatedAmount: number
  remainingAmount: number
  executionRatePercent: number
}

export interface PaymentReconciliation {
  id: string
  receiptNumber: string
  studentCode: string
  studentName: string
  amount: number
  paymentMethod: 'PROMPTPAY' | 'BILL_PAYMENT' | 'BANK_TRANSFER'
  transactionRef: string
  paidAt: string
  reconciled: boolean
}

// 3. Research & Publications Portal
export interface GrantProposal {
  id: string
  projectTitle: string
  principalInvestigator: string
  faculty: string
  grantType: 'INTERNAL_SEED' | 'NATIONAL_NRCT' | 'INDUSTRY_JOINT'
  budgetRequested: number
  durationMonths: number
  submissionDate: string
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUIRED'
}

export interface ResearchProject {
  id: string
  code: string
  title: string
  leadResearcher: string
  fundedAmount: number
  currentMilestone: string
  progressPercent: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'MILESTONE_DUE' | 'COMPLETED'
}

export interface PublicationRecord {
  id: string
  paperTitle: string
  authors: string[]
  journalName: string
  indexing: 'SCOPUS' | 'TCI_TIER_1' | 'TCI_TIER_2' | 'WOS'
  quartile?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  publicationYear: number
  citationsCount: number
  doiUrl: string
}

// 4. Advanced AI/ML Analytics
export interface DropoutRiskPrediction {
  studentId: string
  studentCode: string
  studentName: string
  faculty: string
  yearLevel: number
  currentGpa: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number // 0 - 100
  riskFactors: string[]
  interventionRecommended: string
}

export interface CourseRecommendation {
  courseCode: string
  courseName: string
  credits: number
  matchScore: number // 0 - 100
  reasons: string[]
  prerequisiteMet: boolean
}

export interface AiCopilotQuery {
  prompt: string
  contextCampus?: string
  fiscalYear?: number
}

export interface AiCopilotResponse {
  answer: string
  confidence: number
  generatedAt: string
  suggestedFollowUps: string[]
  supportingDataMetrics?: Record<string, number | string>
}

// 5. CHE / ONESQA Real-time Integration
export interface MhesiSyncStatus {
  serviceName: string
  endpoint: string
  lastSyncTimestamp: string
  status: 'HEALTHY' | 'SYNCING' | 'ERROR' | 'OFFLINE'
  recordsTransferred: number
  validationErrorsCount: number
}

export interface OnesqaSarIndicator {
  indicatorCode: string
  indicatorName: string
  category: 'CURRICULUM' | 'FACULTY_QUALIFICATION' | 'STUDENT_ACHIEVEMENT' | 'RESEARCH_OUTPUT'
  targetScore: number
  actualScore: number
  status: 'EXCEEDED' | 'MET' | 'NEEDS_IMPROVEMENT'
  lastAuditDate: string
}

// 6. Multi-institution & Campus Context
export interface CampusNode {
  id: string
  campusCode: string
  nameTh: string
  nameEn: string
  isMainCampus: boolean
  activeStudents: number
  activeStaff: number
  establishedYear: number
}
