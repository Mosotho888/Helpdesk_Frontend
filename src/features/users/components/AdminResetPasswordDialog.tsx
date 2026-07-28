import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminResetPassword } from '../hooks/useUsers'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const resetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  reason: z.string().optional(),
})
type ResetFormValues = z.infer<typeof resetSchema>

export function AdminResetPasswordDialog({ userId, userName }: { userId: number; userName: string }) {
  const [open, setOpen] = useState(false)
  const resetPassword = useAdminResetPassword()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  function onSubmit(values: ResetFormValues) {
    resetPassword.mutate(
      { userId, payload: values },
      { onSuccess: () => { reset(); setOpen(false) } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm">Reset Password</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register('newPassword')} />
            {errors.newPassword && <p role="alert" className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input id="reason" placeholder="e.g. User locked out, requested via email" {...register('reason')} />
          </div>
          {resetPassword.isError && <p role="alert" className="text-sm text-destructive">Failed to reset password.</p>}
          <Button type="submit" disabled={resetPassword.isPending} className="w-full">
            {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}