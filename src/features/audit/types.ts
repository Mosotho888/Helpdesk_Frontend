export type AuditAction =
  | "TICKET_CREATED" | "STATUS_CHANGED" | "ASSIGNED_TO_AGENT" | "ESCALATED"
  | "PRIORITY_CHANGED" | "TICKET_DELETED" | "TICKET_CLOSED"
  | "USER_CREATED" | "USER_UPDATED" | "USER_DEACTIVATED" | "USER_REACTIVATED"
  | "ROLE_CHANGED" | "PASSWORD_RESET"
  | "AGENT_REGISTERED" | "AVAILABILITY_CHANGED" | "DEPARTMENT_CHANGED"
  | "COMMENT_ADDED" | "COMMENT_EDITED" | "COMMENT_DELETED" | "INTERNAL_NOTE_ADDED"
  | "ATTACHMENT_UPLOADED" | "ATTACHMENT_DELETED" | "ATTACHMENT_DOWNLOADED"
  | "LOGIN_SUCCESS" | "LOGIN_FAILED" | "ACCOUNT_LOCKED" | "TOKEN_REFRESHED" | "FORCED_LOGOUT"

export interface AuditLogResponse {
  id: number
  entityType: string
  entityId: number
  actorId: number
  actorName: string
  actorRole: string
  ipAddress: string
  action: AuditAction
  oldValue: string | null
  newValue: string | null
  description: string | null
  createdAt: string
}