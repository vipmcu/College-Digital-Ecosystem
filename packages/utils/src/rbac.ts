import { RoleCode } from "@repo/types"

export type PermissionAction = "read" | "write" | "delete" | "audit"

export type AppResource =
  | "profile"
  | "students"
  | "courses"
  | "enrollments"
  | "grades"
  | "documents"
  | "dashboard"
  | "system_config"
  | "audit_logs"

/**
 * RBAC Matrix strictly reflecting architecture.md Section 7.2
 */
const ROLE_PERMISSIONS: Record<RoleCode, Record<AppResource, PermissionAction[]>> = {
  student: {
    profile: ["read", "write"],
    students: ["read"], // own only
    courses: ["read"],
    enrollments: ["read", "write"], // own
    grades: ["read"], // own
    documents: ["read", "write"], // own
    dashboard: [],
    system_config: [],
    audit_logs: [],
  },
  instructor: {
    profile: ["read", "write"],
    students: ["read"], // advisees
    courses: ["read"],
    enrollments: ["read"],
    grades: ["read", "write"], // course sections taught
    documents: ["read", "write"],
    dashboard: [],
    system_config: [],
    audit_logs: [],
  },
  registrar: {
    profile: ["read", "write"],
    students: ["read", "write"],
    courses: ["read", "write"],
    enrollments: ["read", "write"],
    grades: ["read", "write"],
    documents: ["read", "write"],
    dashboard: [],
    system_config: [],
    audit_logs: [],
  },
  document_officer: {
    profile: ["read", "write"],
    students: [],
    courses: [],
    enrollments: [],
    grades: [],
    documents: ["read", "write", "delete"],
    dashboard: [],
    system_config: [],
    audit_logs: [],
  },
  executive: {
    profile: ["read", "write"],
    students: ["read"],
    courses: ["read"],
    enrollments: ["read"],
    grades: ["read"],
    documents: ["read", "write"],
    dashboard: ["read"],
    system_config: ["read"],
    audit_logs: ["read"],
  },
  it_admin: {
    profile: ["read", "write", "delete"],
    students: ["read", "write", "delete"],
    courses: ["read", "write", "delete"],
    enrollments: ["read", "write", "delete"],
    grades: ["read", "write", "delete"],
    documents: ["read", "write", "delete"],
    dashboard: ["read"],
    system_config: ["read", "write", "delete"],
    audit_logs: ["read"],
  },
  dpo: {
    profile: ["read"],
    students: ["read", "audit"],
    courses: [],
    enrollments: [],
    grades: [],
    documents: ["audit"],
    dashboard: ["read", "audit"],
    system_config: [],
    audit_logs: ["read", "audit"],
  },
}

export function hasPermission(
  roles: RoleCode[],
  resource: AppResource,
  action: PermissionAction
): boolean {
  return roles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role]?.[resource]
    return permissions ? permissions.includes(action) : false
  })
}
