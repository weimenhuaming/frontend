import { request } from './http'
import type { ArticleInfo } from './article'

export interface UserProfile {
  id: number
  name: string
  phone: string
  email: string
  avatar: string
  role: string
  sex: string
  age: number
}

export interface UpdateUserProfileRequest {
  name?: string
  phone?: string
  sex?: string
  age?: number
  avatar?: string
}

export interface PaginatedArticles {
  articles: ArticleInfo[]
  total: number
  page: number
  page_size: number
}

export function getUserProfile(): Promise<UserProfile> {
  return request<UserProfile>('/user/profile', { method: 'GET' })
}

export function updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
  return request<UserProfile>('/user/profile', {
    method: 'PUT',
    body: data,
  })
}

export function listUserLikedArticles(params: { page?: number, page_size?: number } = {}): Promise<PaginatedArticles> {
  return request<PaginatedArticles>('/user/liked_articles', {
    method: 'POST',
    body: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
    },
  })
}

export function listMyArticles(params: { page?: number, page_size?: number } = {}): Promise<PaginatedArticles> {
  return request<PaginatedArticles>('/user/my_articles', {
    method: 'POST',
    body: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 10,
    },
  })
}
