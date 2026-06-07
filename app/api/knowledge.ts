import { request } from './http'

export interface KnowledgeCollectionInfo {
  name: string
  doc_count: number
  chunk_count: number
  count: number
}

export interface ListKnowledgeCollectionsData {
  collections: KnowledgeCollectionInfo[]
}

export interface BuildKnowledgeData {
  message: string
  doc_count: number
  chunk_count: number
}

export interface SwitchKnowledgeRetrieverData {
  message: string
}

/** 获取知识库 collection 列表（仅管理员） */
export function listKnowledgeCollections() {
  return request<ListKnowledgeCollectionsData>('/agent/knowledge/collections', {
    method: 'GET',
  })
}

/** 构建新知识库 collection（仅管理员） */
export function buildKnowledge(collection: string) {
  return request<BuildKnowledgeData>('/agent/knowledge/build', {
    method: 'POST',
    body: { collection },
  })
}

/** 切换当前问答使用的 collection（仅管理员） */
export function switchKnowledgeRetriever(collection: string) {
  return request<SwitchKnowledgeRetrieverData>('/agent/knowledge/switch', {
    method: 'POST',
    body: { collection },
  })
}

/** 删除 collection（仅管理员） */
export function deleteKnowledgeCollection(collection: string) {
  return request<void>('/agent/knowledge/collection', {
    method: 'DELETE',
    body: { collection },
  })
}
