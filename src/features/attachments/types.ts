import type { UserResponse } from '../users/types'

export interface AttachmentResponse {
  id: number
  ticketId: number
  uploader: UserResponse
  filename: string
  contentType: string
  sizeBytes: number
  downloadUrl: string
  createdAt: string
}