import { request } from './http'

export interface CommentInfo {
  id: number
  article_id: number
  user_id: number
  parent_id: number
  root_id: number
  reply_to_id?: number
  reply_to_name?: string
  content: string
  like_count: number
  child_count: number
  created_at: string
  user_name: string
  user_avatar: string
  replies?: CommentInfo[]
}

export interface GetArticleCommentsParams {
  article_id: number
  page: number
  page_size: number
  order_by?: 'hot' | 'time'
}

export interface PaginatedComments {
  comments: CommentInfo[]
  total: number
  page: number
  page_size: number
}

export interface GetCommentRepliesParams {
  root_id: number
  page: number
  page_size: number
}

export interface PaginatedReplies {
  replies: CommentInfo[]
  total: number
  page: number
  page_size: number
}

export interface CreateCommentRequest {
  article_id: number
  user_id: number
  content: string
}

export interface CreateCommentData {
  comment_id: number
}

export interface CreateReplyRequest {
  root_id: number
  parent_id: number
  user_id: number
  reply_to_id: number
  reply_to_name: string
  content: string
}

export interface CreateReplyData {
  reply_id: number
}

/** 获取文章一级评论列表（无需认证） */
export function getArticleComments(params: GetArticleCommentsParams): Promise<PaginatedComments> {
  return request<PaginatedComments>('/comment/article_list', {
    method: 'POST',
    body: params,
  })
}

/** 获取某条评论下的回复列表（无需认证） */
export function getCommentReplies(params: GetCommentRepliesParams): Promise<PaginatedReplies> {
  return request<PaginatedReplies>('/comment/art_replies_list', {
    method: 'POST',
    body: params,
  })
}

/** 发表一级评论（需认证） */
export function createComment(body: CreateCommentRequest): Promise<CreateCommentData> {
  return request<CreateCommentData>('/comment/create', {
    method: 'POST',
    body,
  })
}

/** 发表回复（需认证） */
export function createReply(body: CreateReplyRequest): Promise<CreateReplyData> {
  return request<CreateReplyData>('/comment/reply/create', {
    method: 'POST',
    body,
  })
}

/** 删除评论（需认证，软删除） */
export function deleteComment(id: number): Promise<void> {
  return request<void>('/comment/delete', {
    method: 'DELETE',
    body: { id },
  })
}

/** 获取用户全部评论（需认证） */
export function getUserComments(params: {
  user_id: number
  page: number
  page_size: number
}): Promise<PaginatedComments> {
  return request<PaginatedComments>('/comment/user/list', {
    method: 'POST',
    body: params,
  })
}
