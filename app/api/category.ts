import { request } from './http'

export interface CategoryInfo {
  id: number
  name: string
}

export interface ListCategoriesData {
  categories: CategoryInfo[]
}

/**
 * 获取博客分类列表
 */
export function listCategories(): Promise<ListCategoriesData> {
  return request<ListCategoriesData>('/category/list', { method: 'GET' })
}

/**
 * 创建分类（需登录）
 */
export function createCategory(name: string): Promise<void> {
  return request<void>('/category/create', {
    method: 'POST',
    body: { name },
  })
}

/**
 * 删除分类（需登录）
 */
export function deleteCategory(id: number): Promise<void> {
  return request<void>('/category/delete', {
    method: 'DELETE',
    body: { id },
  })
}
