import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useTickets } from '../hooks/useTickets'
import type { TicketResponse, TicketStatus, TicketPriority } from '../types'
import { useNavigate } from 'react-router-dom'

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
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('')

  const sortParam = sorting.length > 0 ? [`${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`] : undefined

  const { data, isLoading, isError } = useTickets({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
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

  if (isLoading) return <p>Loading tickets...</p>
  if (isError) return <p>Failed to load tickets.</p>

  return (
    <div>
      <div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as TicketStatus); setPage(0) }}>
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value as TicketPriority); setPage(0) }}>
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {header.isPlaceholder ? null : header.column.columnDef.header as string}
                  {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => navigate(`/tickets/${row.original.id}`)} style={{ cursor: 'pointer' }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {String(cell.getValue())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={data?.first}>
          Previous
        </button>
        <span> Page {page + 1} of {data?.totalPages ?? 1} </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={data?.last}>
          Next
        </button>
      </div>
    </div>
  )
}