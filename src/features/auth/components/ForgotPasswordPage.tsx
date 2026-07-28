import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { requestPasswordReset, confirmPasswordReset } from '../api/authApi'
import {
  requestResetSchema,
  confirmResetSchema,
  type RequestResetFormValues,
  type ConfirmResetFormValues,
} from '../schemas/passwordResetSchemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'REQUEST' | 'CONFIRM'>('REQUEST')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestForm = useForm<RequestResetFormValues>({ resolver: zodResolver(requestResetSchema) })
  const confirmForm = useForm<ConfirmResetFormValues>({ resolver: zodResolver(confirmResetSchema) })

  async function onRequestSubmit(values: RequestResetFormValues) {
    setError(null)
    setIsSubmitting(true)
    try {
      await requestPasswordReset(values.email)
      setEmail(values.email)
      setStep('CONFIRM')
    } catch {
      // Per the API's own design (prevents user enumeration), always show success even on failure
      setEmail(values.email)
      setStep('CONFIRM')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onConfirmSubmit(values: ConfirmResetFormValues) {
    setError(null)
    setIsSubmitting(true)
    try {
      await confirmPasswordReset({ email, otp: values.otp, newPassword: values.newPassword })
      navigate('/login')
    } catch {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 'REQUEST' ? 'Forgot Password' : 'Enter Reset Code'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'REQUEST' ? (
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...requestForm.register('email')} />
                {requestForm.formState.errors.email && (
                  <p role="alert" className="text-sm text-destructive">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={confirmForm.handleSubmit(onConfirmSubmit)} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A 6-digit code was sent to {email} if an account exists.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="otp">Reset Code</Label>
                <Input id="otp" maxLength={6} {...confirmForm.register('otp')} />
                {confirmForm.formState.errors.otp && (
                  <p role="alert" className="text-sm text-destructive">{confirmForm.formState.errors.otp.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...confirmForm.register('newPassword')} />
                {confirmForm.formState.errors.newPassword && (
                  <p role="alert" className="text-sm text-destructive">{confirmForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}