import { useQuery, useMutation } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile, changeOwnPassword } from '../api/userApi'
import type { UpdateUserRequest } from '../types'

export function useMyProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getMyProfile,
  })
}

export function useUpdateProfile(userId: number) {
  return useMutation({
    mutationFn: (payload: UpdateUserRequest) => updateMyProfile(userId, payload),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changeOwnPassword(currentPassword, newPassword),
  })
}