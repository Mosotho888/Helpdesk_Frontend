import type { AssetStatus, WarrantyStatus } from '../types'

export function getAssetStatusBadgeClasses(status: AssetStatus): string {
  switch (status) {
    case 'IN_USE':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'IN_STORAGE':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'UNDER_REPAIR':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'RETIRED':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'LOST':
      return 'bg-red-100 text-red-800 border-red-200'
  }
}

export function getWarrantyBadgeClasses(status: WarrantyStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'EXPIRING_SOON':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'EXPIRED':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'NO_WARRANTY_INFO':
      return 'bg-slate-100 text-slate-500 border-slate-200'
  }
}

export function formatWarrantyStatus(status: WarrantyStatus): string {
  switch (status) {
    case 'NO_WARRANTY_INFO':
      return 'No warranty info'
    case 'ACTIVE':
      return 'Active'
    case 'EXPIRING_SOON':
      return 'Expiring soon'
    case 'EXPIRED':
      return 'Expired'
  }
}

export function formatAssetType(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
