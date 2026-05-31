import { request } from './http'

export interface LikeCountData {
  like_count: number
}

export interface ViewCountData {
  view_count: number
}

export interface ArticleLikeStatusData {
  liked: boolean
}

export interface CommentLikeStatusItem {
  comment_id: number
  liked: boolean
}

export interface BatchCommentLikeStatusData {
  items: CommentLikeStatusItem[]
}

/** 记录文章浏览（无需认证） */
export function viewArticle(articleId: number): Promise<ViewCountData> {
  return request<ViewCountData>('/article/view', {
    method: 'POST',
    body: { article_id: articleId },
  })
}

/** 点赞文章（需认证） */
export function likeArticle(articleId: number): Promise<LikeCountData> {
  return request<LikeCountData>('/article/like', {
    method: 'POST',
    body: { article_id: articleId },
  })
}

/** 取消点赞文章（需认证） */
export function unlikeArticle(articleId: number): Promise<LikeCountData> {
  return request<LikeCountData>('/article/unlike', {
    method: 'POST',
    body: { article_id: articleId },
  })
}

/** 点赞评论（需认证） */
export function likeComment(commentId: number): Promise<LikeCountData> {
  return request<LikeCountData>('/comment/like', {
    method: 'POST',
    body: { comment_id: commentId },
  })
}

/** 取消点赞评论（需认证） */
export function unlikeComment(commentId: number): Promise<LikeCountData> {
  return request<LikeCountData>('/comment/unlike', {
    method: 'POST',
    body: { comment_id: commentId },
  })
}

/** 查询当前用户对文章的点赞状态（需认证） */
export function getArticleLikeStatus(articleId: number): Promise<ArticleLikeStatusData> {
  return request<ArticleLikeStatusData>('/article/like_status', {
    method: 'POST',
    body: { article_id: articleId },
  })
}

/** 批量查询当前用户对评论的点赞状态（需认证） */
export function batchGetCommentLikeStatus(commentIds: number[]): Promise<BatchCommentLikeStatusData> {
  return request<BatchCommentLikeStatusData>('/comment/like_status/batch', {
    method: 'POST',
    body: { comment_ids: commentIds },
  })
}
