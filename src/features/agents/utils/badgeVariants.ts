import type { AgentAvailability } from '../types'

export function getAvailabilityBadgeClasses(availability: AgentAvailability | null): string {
  switch (availability) {
    case 'ONLINE':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'BUSY':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'AWAY':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'OFFLINE':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}