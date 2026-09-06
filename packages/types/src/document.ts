export type DocumentStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'archived'

export type WorkflowStepStatus = 'pending' | 'approved' | 'rejected' | 'skipped'

export interface DocumentMetadata {
  id: string
  documentTypeId: string
  docNumber?: string
  subject: string
  status: DocumentStatus
  createdByUserId: string
  createdAt: string
}
