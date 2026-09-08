import type { UserResponse } from '../users/types'

export type AssetType =
  | 'LAPTOP'
  | 'DESKTOP'
  | 'PRINTER'
  | 'MONITOR'
  | 'NETWORKING_EQUIPMENT'
  | 'SOFTWARE_LICENSE'
  | 'OTHER'

export type AssetStatus = 'IN_USE' | 'IN_STORAGE' | 'UNDER_REPAIR' | 'RETIRED' | 'LOST'

export type WarrantyStatus = 'NO_WARRANTY_INFO' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED'

export interface AssetResponse {
  id: number
  assetTag: string
  name: string
  type: AssetType
  status: AssetStatus
  serialNumber: string | null
  manufacturer: string | null
  model: string | null
  assignedUser: UserResponse | null
  location: string | null
  vendor: string | null
  purchaseDate: string | null
  purchaseCost: number | null
  warrantyExpiryDate: string | null
  warrantyStatus: WarrantyStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface PageAssetResponse {
  totalElements: number
  totalPages: number
  size: number
  content: AssetResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface CreateAssetRequest {
  assetTag?: string
  name: string
  type: AssetType
  serialNumber?: string
  manufacturer?: string
  model?: string
  assignedUserId?: number
  location?: string
  vendor?: string
  purchaseDate?: string
  purchaseCost?: number
  warrantyExpiryDate?: string
  notes?: string
}

export interface UpdateAssetRequest {
  name?: string
  type?: AssetType
  status?: AssetStatus
  serialNumber?: string
  manufacturer?: string
  model?: string
  assignedUserId?: number
  /** Explicitly unassigns the asset - see the backend's ADR 0007 for why this isn't just `assignedUserId: null`. */
  clearAssignedUser?: boolean
  location?: string
  vendor?: string
  purchaseDate?: string
  purchaseCost?: number
  warrantyExpiryDate?: string
  notes?: string
}

export interface TicketAssetLinkResponse {
  ticketId: number
  assetId: number
  assetTag: string
  assetName: string
  linkedByName: string
  linkedAt: string
}

export interface AssetTicketHistoryResponse {
  ticketId: number
  subject: string
  status: string
  priority: string
  linkedAt: string
}

export interface PageAssetTicketHistoryResponse {
  totalElements: number
  totalPages: number
  size: number
  content: AssetTicketHistoryResponse[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}
