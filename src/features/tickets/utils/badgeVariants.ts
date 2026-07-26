import type { TicketStatus, TicketPriority } from '../types'

export function getStatusBadgeClasses(status: TicketStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'IN_PROGRESS':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'ESCALATED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CLOSED':
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getPriorityBadgeClasses(priority: TicketPriority): string {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'LOW':
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}