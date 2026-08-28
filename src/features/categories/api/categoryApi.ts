import apiClient from '../../../shared/lib/axiosClient'
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types'

export async function getCategoryTree(activeOnly = true): Promise<CategoryResponse[]> {
  const response = await apiClient.get<CategoryResponse[]>('/categories', {
    params: { activeOnly },
  })
  return response.data
}

export async function createCategory(payload: CreateCategoryRequest): Promise<CategoryResponse> {
  const response = await apiClient.post<CategoryResponse>('/categories', payload)
  return response.data
}

export async function updateCategory(
  id: number,
  payload: UpdateCategoryRequest
): Promise<CategoryResponse> {
  const response = await apiClient.patch<CategoryResponse>(`/categories/${id}`, payload)
  return response.data
}

export async function deactivateCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}
