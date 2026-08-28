import { useQuery } from '@tanstack/react-query'
import { getCategoryTree } from '../api/categoryApi'

export function useCategoryTree(activeOnly = true) {
  return useQuery({
    queryKey: ['categories', 'tree', activeOnly],
    queryFn: () => getCategoryTree(activeOnly),
    staleTime: 5 * 60 * 1000, // the category tree changes rarely; no need to refetch on every mount
  })
}
