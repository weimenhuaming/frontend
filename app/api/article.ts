import { request } from './http'

export interface ArticleInfo {
  id: number
  user_id: number
  category_id: number
  title: string
  summary: string
  content: string
  cover: string
  view_count: number
  like_count: number
  favor_count: number
  comment_count: number
  created_at: string
  updated_at: string
  author_name: string
  author_avatar: string
}

export interface ListArticlesData {
  articles: ArticleInfo[]
  total: number
  page: number
  page_size: number
}

export interface CreateArticleRequest {
  category_id: number
  title: string
  summary: string
  content: string
  cover: string
  user_id: number
}

export interface UpdateArticleRequest {
  id: number
  category_id?: number
  title?: string
  summary?: string
  content?: string
  cover?: string
}

export interface ListArticlesRequest {
  page: number
  page_size: number
}

export interface GetArticlesByCategoryRequest {
  category_id: number
  page: number
  page_size: number
}

export interface SearchArticlesRequest {
  keyword: string
  page: number
  page_size: number
  category_id?: number
}

/**
 * 获取文章详情
 */
export function getArticleDetail(id: number): Promise<ArticleInfo> {
  return request<ArticleInfo>('/article/detail', {
    method: 'POST',
    body: { id },
  })
}

/**
 * 获取文章列表
 */
export function listArticles(params: ListArticlesRequest): Promise<ListArticlesData> {
  return request<ListArticlesData>('/article/list', {
    method: 'POST',
    body: params,
  })
}

/**
 * 获取分类下文章列表
 */
export function getArticlesByCategory(params: GetArticlesByCategoryRequest): Promise<ListArticlesData> {
  return request<ListArticlesData>('/article/list_by_category', {
    method: 'POST',
    body: params,
  })
}

/**
 * 搜索文章
 */
export function searchArticles(params: SearchArticlesRequest): Promise<ListArticlesData> {
  return request<ListArticlesData>('/article/search', {
    method: 'POST',
    body: params,
  })
}

/**
 * 创建文章（需登录）
 */
export function createArticle(params: CreateArticleRequest): Promise<void> {
  return request<void>('/article/create', {
    method: 'POST',
    body: params,
  })
}

/**
 * 更新文章（需登录）
 */
export function updateArticle(params: UpdateArticleRequest): Promise<void> {
  return request<void>('/article/update', {
    method: 'PUT',
    body: params,
  })
}

/**
 * 删除文章（需登录）
 */
export function deleteArticle(id: number): Promise<void> {
  return request<void>('/article/delete', {
    method: 'DELETE',
    body: { id },
  })
}
