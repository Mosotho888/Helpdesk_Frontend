import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, createUser, changeUserRole, deactivateUser, reactivateUser } from '../api/userApi'
import type { CreateUserRequest } from '../types'

export function useUsers(page = 0, size = 20) {
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: () => getUsers(page, size),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => changeUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useReactivateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => reactivateUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}