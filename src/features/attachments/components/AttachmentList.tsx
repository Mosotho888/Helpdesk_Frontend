import { useState, type ChangeEvent } from 'react'
import { useAttachments, useUploadAttachments, useDeleteAttachment } from '../hooks/useAttachments'
import { downloadAttachment } from '../api/attachmentApi'

const MAX_FILES = 5
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentList({ ticketId }: { ticketId: number }) {
  const { data: attachments, isLoading } = useAttachments(ticketId)
  const upload = useUploadAttachments(ticketId)
  const deleteAttachmentMutation = useDeleteAttachment(ticketId)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    setValidationError(null)
    const files = Array.from(e.target.files ?? [])

    if (files.length === 0) return

    if (files.length > MAX_FILES) {
      setValidationError(`You can upload a maximum of ${MAX_FILES} files at once.`)
      e.target.value = ''
      return
    }

    const oversizedFile = files.find((f) => f.size > MAX_SIZE_BYTES)
    if (oversizedFile) {
      setValidationError(`"${oversizedFile.name}" exceeds the 20 MB limit.`)
      e.target.value = ''
      return
    }

    upload.mutate(files, { onSuccess: () => { e.target.value = '' } })
  }

  if (isLoading) return <p>Loading attachments...</p>

  return (
    <div style={{ margin: '1rem 0' }}>
      <h3>Attachments</h3>

      {attachments && attachments.length > 0 ? (
        <ul>
          {attachments.map((attachment) => (
            <li key={attachment.id}>
              <button onClick={() => downloadAttachment(attachment.id, attachment.filename)}>
                {attachment.filename}
              </button>
              {' '}({formatBytes(attachment.sizeBytes)}, uploaded by {attachment.uploader.name})
              {' '}
              <button
                onClick={() => deleteAttachmentMutation.mutate(attachment.id)}
                disabled={deleteAttachmentMutation.isPending}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No attachments yet.</p>
      )}

      <input type="file" multiple onChange={handleFileSelect} disabled={upload.isPending} />
      {upload.isPending && <p>Uploading...</p>}
      {validationError && <p role="alert" style={{ color: 'red' }}>{validationError}</p>}
      {upload.isError && <p role="alert" style={{ color: 'red' }}>Upload failed.</p>}
    </div>
  )
}