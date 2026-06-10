<script setup lang="ts">
import {
  createReply,
  deleteComment,
  getCommentReplies,
  type CommentInfo,
} from '~/api/comment'
import { batchGetCommentLikeStatus } from '~/api/interaction'
import LikeButton from '~/components/LikeButton.vue'
import { resolveMediaUrl } from '~/utils/media'

const props = defineProps<{
  comment: CommentInfo
  articleId: number
  likeStatus?: boolean
}>()

const emit = defineEmits<{
  deleted: [rootId: number]
  countChange: [delta: number]
}>()

const auth = useAuth()
const config = useRuntimeConfig()

function avatarSrc(url: string) {
  return resolveMediaUrl(url, config.public.apiBase)
}

const replies = ref<CommentInfo[]>([])
const repliesPage = ref(0)
const repliesTotal = ref(props.comment.child_count)
const loadingReplies = ref(false)
const replyLikeStatus = ref<Record<number, boolean>>({})
const replyTarget = ref<CommentInfo | null>(null)
const replyContent = ref('')
const submitting = ref(false)
const deleting = ref(false)
const deleteTarget = ref<{ id: number, isRoot: boolean } | null>(null)
const deleteDialogOpen = computed({
  get: () => deleteTarget.value !== null,
  set: (open: boolean) => {
    if (!open)
      deleteTarget.value = null
  },
})

const REPLY_PAGE_SIZE = 5

const hasMoreReplies = computed(() => replies.value.length < repliesTotal.value)

const replyLoadLabel = computed(() => {
  if (loadingReplies.value)
    return '加载中...'
  if (replies.value.length === 0)
    return `查看 ${repliesTotal.value} 条回复`
  return `查看更多回复（${replies.value.length}/${repliesTotal.value}）`
})

function formatTime(dateStr: string) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime()))
    return dateStr
  const now = Date.now()
  const diff = now - date.getTime()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute)
    return '刚刚'
  if (diff < hour)
    return `${Math.floor(diff / minute)}分钟前`
  if (diff < day)
    return `${Math.floor(diff / hour)}小时前`
  if (diff < 7 * day)
    return `${Math.floor(diff / day)}天前`
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function requireLogin(): boolean {
  auth.hydrate()
  if (auth.isLoggedIn.value)
    return true
  navigateTo({ path: '/auth/login', query: { redirect: useRoute().fullPath } })
  return false
}

function openReply(target: CommentInfo) {
  if (!requireLogin())
    return
  replyTarget.value = target
  replyContent.value = ''
}

function cancelReply() {
  replyTarget.value = null
  replyContent.value = ''
}

async function fetchReplyLikeStatus(ids: number[]) {
  auth.hydrate()
  if (!auth.isLoggedIn.value || !ids.length)
    return
  try {
    const data = await batchGetCommentLikeStatus(ids)
    for (const item of data.items)
      replyLikeStatus.value[item.comment_id] = item.liked
  }
  catch (e) {
    console.error(e)
  }
}

async function loadReplies() {
  if (loadingReplies.value || !hasMoreReplies.value)
    return
  loadingReplies.value = true
  try {
    const nextPage = repliesPage.value + 1
    const data = await getCommentReplies({
      root_id: props.comment.id,
      page: nextPage,
      page_size: REPLY_PAGE_SIZE,
    })
    replies.value.push(...data.replies)
    repliesTotal.value = data.total
    repliesPage.value = nextPage
    await fetchReplyLikeStatus(data.replies.map(r => r.id))
  }
  catch (e) {
    alert(e instanceof Error ? e.message : '加载回复失败')
  }
  finally {
    loadingReplies.value = false
  }
}

async function submitReply() {
  const content = replyContent.value.trim()
  if (!content || !replyTarget.value || !auth.user.value)
    return
  submitting.value = true
  try {
    const target = replyTarget.value
    await createReply({
      root_id: props.comment.id,
      parent_id: target.id,
      user_id: auth.user.value.id,
      reply_to_id: target.user_id,
      reply_to_name: target.user_name,
      content,
    })
    cancelReply()
    const targetSize = replies.value.length + 1
    const data = await getCommentReplies({
      root_id: props.comment.id,
      page: 1,
      page_size: Math.max(targetSize, REPLY_PAGE_SIZE),
    })
    replies.value = data.replies.slice(0, targetSize)
    repliesTotal.value = data.total
    repliesPage.value = Math.ceil(replies.value.length / REPLY_PAGE_SIZE)
    emit('countChange', 1)
  }
  catch (e) {
    alert(e instanceof Error ? e.message : '回复失败')
  }
  finally {
    submitting.value = false
  }
}

function handleDelete(id: number, isRoot: boolean) {
  deleteTarget.value = { id, isRoot }
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target)
    return

  deleting.value = true
  try {
    await deleteComment(target.id)
    if (target.isRoot) {
      emit('deleted', target.id)
    }
    else {
      replies.value = replies.value.filter(r => r.id !== target.id)
      repliesTotal.value = Math.max(0, repliesTotal.value - 1)
      emit('countChange', -1)
    }
    deleteTarget.value = null
  }
  catch (e) {
    alert(e instanceof Error ? e.message : '删除失败')
  }
  finally {
    deleting.value = false
  }
}

function isOwn(userId: number) {
  return auth.user.value?.id === userId
}
</script>

<template>
  <article class="comment-item">
    <div class="comment-item__main">
      <img
        v-if="comment.user_avatar"
        :src="avatarSrc(comment.user_avatar)"
        :alt="comment.user_name"
        class="comment-item__avatar"
      >
      <div
        v-else
        class="comment-item__avatar comment-item__avatar--placeholder"
        aria-hidden="true"
      >
        {{ comment.user_name?.charAt(0) || '?' }}
      </div>

      <div class="comment-item__body">
        <div class="comment-item__header">
          <span class="comment-item__name">{{ comment.user_name }}</span>
          <time class="comment-item__time">{{ formatTime(comment.created_at) }}</time>
        </div>

        <p class="comment-item__content">
          {{ comment.content }}
        </p>

        <div class="comment-item__actions">
          <LikeButton
            type="comment"
            :target-id="comment.id"
            :initial-count="comment.like_count"
            :initial-liked="likeStatus"
          />
          <button type="button" class="comment-item__action" @click="openReply(comment)">
            回复
          </button>
          <button
            v-if="isOwn(comment.user_id)"
            type="button"
            class="comment-item__action comment-item__action--danger"
            :disabled="deleting"
            @click="handleDelete(comment.id, true)"
          >
            删除
          </button>
        </div>

        <!-- 回复输入框 -->
        <div v-if="replyTarget?.id === comment.id" class="comment-item__reply-form">
          <textarea
            v-model="replyContent"
            class="comment-item__textarea"
            :placeholder="`回复 @${replyTarget.user_name}`"
            rows="2"
            maxlength="500"
          />
          <div class="comment-item__reply-actions">
            <button type="button" class="comment-item__btn comment-item__btn--ghost" @click="cancelReply">
              取消
            </button>
            <button
              type="button"
              class="comment-item__btn comment-item__btn--primary"
              :disabled="!replyContent.trim() || submitting"
              @click="submitReply"
            >
              {{ submitting ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>

        <!-- 二级回复列表 -->
        <div v-if="replies.length" class="comment-item__replies">
          <div
            v-for="reply in replies"
            :key="reply.id"
            class="comment-item__reply"
          >
            <img
              v-if="reply.user_avatar"
              :src="avatarSrc(reply.user_avatar)"
              :alt="reply.user_name"
              class="comment-item__reply-avatar"
            >
            <div
              v-else
              class="comment-item__reply-avatar comment-item__reply-avatar--placeholder"
              aria-hidden="true"
            >
              {{ reply.user_name?.charAt(0) || '?' }}
            </div>

            <div class="comment-item__reply-body">
              <div class="comment-item__header">
                <span class="comment-item__name">{{ reply.user_name }}</span>
                <time class="comment-item__time">{{ formatTime(reply.created_at) }}</time>
              </div>

              <p class="comment-item__content">
                <span v-if="reply.reply_to_name" class="comment-item__at">@{{ reply.reply_to_name }}</span>
                {{ reply.content }}
              </p>

              <div class="comment-item__actions">
                <LikeButton
                  type="comment"
                  :target-id="reply.id"
                  :initial-count="reply.like_count"
                  :initial-liked="replyLikeStatus[reply.id]"
                />
                <button type="button" class="comment-item__action" @click="openReply(reply)">
                  回复
                </button>
                <button
                  v-if="isOwn(reply.user_id)"
                  type="button"
                  class="comment-item__action comment-item__action--danger"
                  :disabled="deleting"
                  @click="handleDelete(reply.id, false)"
                >
                  删除
                </button>
              </div>

              <div v-if="replyTarget?.id === reply.id" class="comment-item__reply-form">
                <textarea
                  v-model="replyContent"
                  class="comment-item__textarea"
                  :placeholder="`回复 @${replyTarget.user_name}`"
                  rows="2"
                  maxlength="500"
                />
                <div class="comment-item__reply-actions">
                  <button type="button" class="comment-item__btn comment-item__btn--ghost" @click="cancelReply">
                    取消
                  </button>
                  <button
                    type="button"
                    class="comment-item__btn comment-item__btn--primary"
                    :disabled="!replyContent.trim() || submitting"
                    @click="submitReply"
                  >
                    {{ submitting ? '发送中...' : '发送' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 展开 / 加载更多回复 -->
        <button
          v-if="repliesTotal > 0 && hasMoreReplies"
          type="button"
          class="comment-item__expand"
          :disabled="loadingReplies"
          @click="loadReplies"
        >
          {{ replyLoadLabel }}
        </button>
      </div>
    </div>
    <ConfirmDialog
      v-model="deleteDialogOpen"
      title="删除评论"
      message="确定删除这条评论吗？"
      confirm-text="删除"
      danger
      :loading="deleting"
      @confirm="confirmDelete"
    />
  </article>
</template>

<style scoped>
.comment-item + .comment-item {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
}

.comment-item__main {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.comment-item__avatar {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  object-fit: cover;
}

.comment-item__avatar--placeholder {
  display: grid;
  place-items: center;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.875rem;
  font-weight: 600;
}

.comment-item__body {
  flex: 1;
  min-width: 0;
}

.comment-item__header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.comment-item__name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
}

.comment-item__time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-item__content {
  margin: 0.35rem 0 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #374151;
  word-break: break-word;
}

.comment-item__at {
  color: var(--home-accent-dark);
  margin-right: 0.25rem;
}

.comment-item__actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.45rem;
  flex-wrap: wrap;
}

.comment-item__action {
  padding: 0;
  border: none;
  background: none;
  font-size: 0.75rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.15s;
}

.comment-item__action:hover {
  color: var(--home-accent-dark);
}

.comment-item__action--danger:hover {
  color: #ef4444;
}

.comment-item__reply-form {
  margin-top: 0.65rem;
}

.comment-item__textarea {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 10px;
  background: rgb(255 255 255 / 80%);
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

.comment-item__textarea:focus {
  border-color: var(--home-accent);
}

.comment-item__reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.45rem;
}

.comment-item__btn {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: none;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.comment-item__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-item__btn--ghost {
  background: rgb(0 0 0 / 5%);
  color: #6b7280;
}

.comment-item__btn--primary {
  background: var(--home-accent);
  color: #fff;
}

.comment-item__replies {
  margin-top: 0.85rem;
  padding: 0.65rem 0.75rem;
  border-radius: 12px;
  background: rgb(0 0 0 / 3%);
}

.comment-item__reply {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
}

.comment-item__reply + .comment-item__reply {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(0 0 0 / 5%);
}

.comment-item__reply-avatar {
  flex-shrink: 0;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 999px;
  object-fit: cover;
}

.comment-item__reply-avatar--placeholder {
  display: grid;
  place-items: center;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.7rem;
  font-weight: 600;
}

.comment-item__reply-body {
  flex: 1;
  min-width: 0;
}

.comment-item__expand {
  display: block;
  margin-top: 0.65rem;
  padding: 0;
  border: none;
  background: none;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--home-accent-dark);
  cursor: pointer;
  transition: color 0.15s;
}

.comment-item__expand:hover:not(:disabled) {
  color: var(--home-accent);
}

.comment-item__expand:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
