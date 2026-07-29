import { useState } from 'react'
import { useUsers, useChangeUserRole, useDeactivateUser, useReactivateUser } from '../hooks/useUsers'
import { CreateUserDialog } from './CreateUserDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminResetPasswordDialog } from './AdminResetPasswordDialog'

export function UserManagement() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useUsers(page)
  const changeRole = useChangeUserRole()
  const deactivate = useDeactivateUser()
  const reactivate = useReactivateUser()

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading users...</p>
  if (isError) return <p className="p-6 text-destructive">Failed to load users.</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Administration</h1>
        <CreateUserDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.content.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(role) => role && changeRole.mutate({ userId: u.id, role })}
                    disabled={changeRole.isPending}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge className={u.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                    {u.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.active ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deactivate.mutate(u.id)}
                      disabled={deactivate.isPending}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => reactivate.mutate(u.id)}
                      disabled={reactivate.isPending}
                    >
                      Reactivate
                    </Button>
                  )}
                  <AdminResetPasswordDialog userId={u.id} userName={u.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={data?.first}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page + 1} of {data?.totalPages ?? 1}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={data?.last}>
          Next
        </Button>
      </div>
    </div>
  )
}