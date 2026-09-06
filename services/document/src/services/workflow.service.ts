import { prisma } from "@repo/db"
import { hashSha256 } from "@repo/utils"

export async function createDocumentWithWorkflow(data: {
  documentTypeId: string
  subject: string
  body?: string
  createdByUserId: string
  orgUnitId?: string
  approvalSteps?: Array<{ stepNumber: number; stepName: string; approverId?: string; approverRole?: string }>
}) {
  const docNumber = `DOC-${new Date().getFullYear() + 543}-${Math.floor(10000 + Math.random() * 90000)}`

  const document = await prisma.document.create({
    data: {
      documentTypeId: data.documentTypeId,
      docNumber,
      subject: data.subject,
      body: data.body,
      status: "draft",
      createdByUserId: data.createdByUserId,
      orgUnitId: data.orgUnitId,
    },
  })

  // Create associated workflow
  const steps = data.approvalSteps && data.approvalSteps.length > 0
    ? data.approvalSteps
    : [
        { stepNumber: 1, stepName: "หัวหน้างาน/หัวหน้าสาขา", approverRole: "instructor" },
        { stepNumber: 2, stepName: "คณบดี/ผู้อำนวยการ", approverRole: "executive" },
      ]

  const workflow = await prisma.workflow.create({
    data: {
      name: `Workflow: ${data.subject}`,
      documentId: document.id,
      currentStep: 1,
      totalSteps: steps.length,
      status: "active",
      steps: {
        create: steps.map((s) => ({
          stepNumber: s.stepNumber,
          stepName: s.stepName,
          approverId: s.approverId,
          approverRole: s.approverRole,
          status: "pending",
        })),
      },
    },
    include: { steps: true },
  })

  return { document, workflow }
}

export async function submitDocument(documentId: string, actorId: string) {
  const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } })
  if (doc.createdByUserId !== actorId) {
    throw new Error("Only the author can submit this document")
  }
  if (doc.status !== "draft") {
    throw new Error("Document is already submitted")
  }

  return prisma.document.update({
    where: { id: documentId },
    data: {
      status: "pending_approval",
      submittedAt: new Date(),
    },
  })
}

export async function processApprovalStep(params: {
  workflowId: string
  stepNumber: number
  actorId: string
  action: "approved" | "rejected"
  comment?: string
}) {
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where: { id: params.workflowId },
    include: { steps: true, document: true },
  })

  const step = workflow.steps.find((s: any) => s.stepNumber === params.stepNumber)
  if (!step) throw new Error("Workflow step not found")
  if (step.status !== "pending") throw new Error("This step is already processed")

  // Update step
  await prisma.workflowStep.update({
    where: { id: step.id },
    data: {
      status: params.action,
      actionAt: new Date(),
      comment: params.comment,
      approverId: params.actorId,
    },
  })

  if (params.action === "rejected") {
    // If rejected, mark workflow and document as rejected
    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: "rejected", completedAt: new Date() },
    })
    if (workflow.documentId) {
      await prisma.document.update({
        where: { id: workflow.documentId },
        data: { status: "rejected" },
      })
    }
    return { status: "rejected", currentStep: params.stepNumber }
  }

  // If approved: check if this is the final step
  if (params.stepNumber >= workflow.totalSteps) {
    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: "completed", completedAt: new Date() },
    })
    if (workflow.documentId) {
      await prisma.document.update({
        where: { id: workflow.documentId },
        data: { status: "approved" },
      })
    }
    return { status: "completed", currentStep: params.stepNumber }
  }

  // Advance to next step
  const nextStep = params.stepNumber + 1
  await prisma.workflow.update({
    where: { id: workflow.id },
    data: { currentStep: nextStep },
  })

  return { status: "active", currentStep: nextStep }
}

export async function signDocument(params: {
  documentId: string
  signerId: string
  ipAddress: string
  metadata?: Record<string, unknown>
}) {
  const doc = await prisma.document.findUniqueOrThrow({ where: { id: params.documentId } })

  // Calculate cryptographic SHA-256 hash of the document content
  const payloadToHash = `${doc.id}:${doc.docNumber}:${doc.subject}:${doc.body || ""}:${doc.status}`
  const signatureHash = hashSha256(payloadToHash)

  const signature = await prisma.digitalSignature.create({
    data: {
      documentId: params.documentId,
      signerId: params.signerId,
      signatureType: "simple_electronic",
      signatureHash,
      ipAddress: params.ipAddress || "127.0.0.1",
      metadata: (params.metadata || {}) as any,
    },
  })

  return signature
}
