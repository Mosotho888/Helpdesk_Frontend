import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAttachments, uploadAttachments, deleteAttachment } from '../api/attachmentApi'

export function useAttachments(ticketId: number) {
  return useQuery({
    queryKey: ['attachments', ticketId],
    queryFn: () => getAttachments(ticketId),
    enabled: !!ticketId,
  })
}

export function useUploadAttachments(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (files: File[]) => uploadAttachments(ticketId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] })
    },
  })
}

export function useDeleteAttachment(ticketId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: number) => deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] })
    },
  })
}