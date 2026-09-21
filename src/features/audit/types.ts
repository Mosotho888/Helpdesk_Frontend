export type AuditAction =
  | "TICKET_CREATED" | "STATUS_CHANGED" | "ASSIGNED_TO_AGENT" | "ESCALATED"
  | "PRIORITY_CHANGED" | "CATEGORY_CHANGED" | "TICKET_DELETED" | "TICKET_CLOSED"
  | "USER_CREATED" | "USER_UPDATED" | "USER_DEACTIVATED" | "USER_REACTIVATED"
  | "ROLE_CHANGED" | "PASSWORD_RESET"
  | "AGENT_REGISTERED" | "AVAILABILITY_CHANGED" | "DEPARTMENT_CHANGED"
  | "COMMENT_ADDED" | "COMMENT_EDITED" | "COMMENT_DELETED" | "INTERNAL_NOTE_ADDED"
  | "ATTACHMENT_UPLOADED" | "ATTACHMENT_DELETED" | "ATTACHMENT_DOWNLOADED"
  | "ASSET_CREATED" | "ASSET_UPDATED" | "ASSET_STATUS_CHANGED" | "ASSET_ASSIGNED"
  | "ASSET_LOCATION_CHANGED" | "ASSET_RETIRED"
  | "ASSET_LINKED_TO_TICKET" | "ASSET_UNLINKED_FROM_TICKET"
  | "KB_ARTICLE_CREATED" | "KB_ARTICLE_UPDATED" | "KB_ARTICLE_PUBLISHED"
  | "KB_ARTICLE_ARCHIVED" | "KB_ARTICLE_DELETED"
  | "KB_ARTICLE_LINKED_TO_TICKET" | "KB_ARTICLE_UNLINKED_FROM_TICKET"
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

export interface PageAuditLogResponse {
  totalElements: number
  totalPages: number
  size: number
  content: AuditLogResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}
