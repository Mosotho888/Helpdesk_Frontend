import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { useTickets } from '../hooks/useTickets'
import type { TicketResponse, TicketStatus, TicketPriority } from '../types'
import { getStatusBadgeClasses, getPriorityBadgeClasses } from '../utils/badgeVariants'
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

const columnHelper = createColumnHelper<TicketResponse>()

const columns = [
  columnHelper.accessor('subject', { header: 'Subject' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('priority', { header: 'Priority' }),
  columnHelper.accessor((row) => row.assignee?.name ?? 'Unassigned', {
    id: 'assignee',
    header: 'Assignee',
  }),
]

export function TicketTable() {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL')

  const sortParam = sorting.length > 0 ? [`${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`] : undefined

  const { data, isLoading, isError } = useTickets({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
    page,
    size: 20,
    sort: sortParam,
  })

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    state: { sorting },
    onSortingChange: setSorting,
    pageCount: data?.totalPages ?? -1,
  })

  // Helper function to render modern sorting indicators
  const renderSortIcon = (isSorted: false | string) => {
    if (isSorted === 'asc') {
      return <ArrowUp className="h-4 w-4 text-foreground" />
    }
    if (isSorted === 'desc') {
      return <ArrowDown className="h-4 w-4 text-foreground" />
    }
    return <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
  }

  if (isLoading) return <p className="p-4 text-muted-foreground">Loading tickets...</p>
  if (isError) return <p className="p-4 text-destructive">Failed to load tickets.</p>

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as TicketStatus | 'ALL'); setPage(0) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="ESCALATED">Escalated</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v as TicketPriority | 'ALL'); setPage(0) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : (header.column.columnDef.header as string)}
                        </span>
                        {renderSortIcon(isSorted)}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => navigate(`/tickets/${row.original.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{row.original.subject}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClasses(row.original.status)}>
                    {row.original.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityBadgeClasses(row.original.priority)}>
                    {row.original.priority}
                  </Badge>
                </TableCell>
                <TableCell>{row.original.assignee?.name ?? 'Unassigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={data?.first}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {data?.totalPages ?? 1}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={data?.last}
        >
          Next
        </Button>
      </div>
    </div>
  )
}