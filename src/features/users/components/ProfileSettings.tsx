import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMyProfile, useUpdateProfile, useChangePassword } from '../hooks/useProfile'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileFormValues,
  type ChangePasswordFormValues,
} from '../schemas/profileSchemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function ProfileInfoForm() {
  const { data: profile, isLoading } = useMyProfile()
  const updateProfile = useUpdateProfile(profile?.id ?? 0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  })

  // Populate the form once the profile loads — can't set defaultValues before the data exists
  useEffect(() => {
    if (profile) {
      reset({ name: profile.name, phone: profile.phone ?? '', timezone: profile.timezone ?? '' })
    }
  }, [profile, reset])

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile.mutate(values)
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading profile...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="+27821234567" {...register('phone')} />
        {errors.phone && <p role="alert" className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="timezone">Timezone</Label>
        <Input id="timezone" placeholder="Africa/Johannesburg" {...register('timezone')} />
      </div>

      {updateProfile.isSuccess && <p className="text-sm text-green-700">Profile updated successfully.</p>}
      {updateProfile.isError && <p role="alert" className="text-sm text-destructive">Failed to update profile.</p>}

      <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}

function ChangePasswordForm() {
  const changePassword = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" type="password" {...register('currentPassword')} />
        {errors.currentPassword && <p role="alert" className="text-sm text-destructive">{errors.currentPassword.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" type="password" {...register('newPassword')} />
        {errors.newPassword && <p role="alert" className="text-sm text-destructive">{errors.newPassword.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p role="alert" className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      {changePassword.isSuccess && <p className="text-sm text-green-700">Password changed successfully.</p>}
      {changePassword.isError && <p role="alert" className="text-sm text-destructive">Failed to change password. Check your current password.</p>}

      <Button type="submit" disabled={changePassword.isPending}>
        {changePassword.isPending ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  )
}

export function ProfileSettings() {
  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileInfoForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}