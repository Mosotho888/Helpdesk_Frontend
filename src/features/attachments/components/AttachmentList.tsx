import { useState, type ChangeEvent } from 'react'
import { useAttachments, useUploadAttachments, useDeleteAttachment } from '../hooks/useAttachments'
import { downloadAttachment } from '../api/attachmentApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MAX_FILES = 5
const MAX_SIZE_BYTES = 20 * 1024 * 1024

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

  return (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Attachments</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading attachments...</p>
      ) : attachments && attachments.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
              <div>
                <button
                  onClick={() => downloadAttachment(attachment.id, attachment.filename)}
                  className="font-medium text-primary hover:underline"
                >
                  {attachment.filename}
                </button>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(attachment.sizeBytes)} · uploaded by {attachment.uploader.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteAttachmentMutation.mutate(attachment.id)}
                disabled={deleteAttachmentMutation.isPending}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No attachments yet.</p>
      )}

      <div className="space-y-1.5 pt-2 border-t">
        <label className="text-sm font-medium">Upload new file</label>
        <Input
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={upload.isPending}
          className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-3 file:py-1.5 file:mr-3 file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary/90"
        />
        {upload.isPending && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {validationError && <p role="alert" className="text-sm text-destructive">{validationError}</p>}
        {upload.isError && <p role="alert" className="text-sm text-destructive">Upload failed.</p>}
      </div>
    </CardContent>
  </Card>
  )
}