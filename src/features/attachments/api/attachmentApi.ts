import apiClient from '../../../shared/lib/axiosClient'
import type { AttachmentResponse } from '../types'

export async function getAttachments(ticketId: number): Promise<AttachmentResponse[]> {
  const response = await apiClient.get<AttachmentResponse[]>(`/tickets/${ticketId}/attachments`)
  return response.data
}

export async function uploadAttachments(ticketId: number, files: File[]): Promise<AttachmentResponse[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('file', file))

  const response = await apiClient.post<AttachmentResponse[]>(
    `/tickets/${ticketId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export async function downloadAttachment(attachmentId: number, filename: string): Promise<void> {
  const response = await apiClient.get(`/attachments/${attachmentId}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function deleteAttachment(attachmentId: number): Promise<void> {
  await apiClient.delete(`/attachments/${attachmentId}`)
}