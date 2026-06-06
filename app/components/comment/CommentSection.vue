<script setup lang="ts">
import {
  createComment,
  getArticleComments,
  type CommentInfo,
} from '~/api/comment'
import { batchGetCommentLikeStatus } from '~/api/interaction'

const props = defineProps<{
  articleId: number
}>()

const emit = defineEmits<{
  countChange: [delta: number]
}>()

const auth = useAuth()
const { avatarUrl, displayName } = useUserAvatar()

const COMMENT_PAGE_SIZE = 5

const comments = ref<CommentInfo[]>([])
const total = ref(0)
const page = ref(1)
const orderBy = ref<'time' | 'hot'>('time')
const loading = ref(false)
const loadingMore = ref(false)
const content = ref('')
const submitting = ref(false)
const likeStatusMap = ref<Record<number, boolean>>({})

const hasMore = computed(() => comments.value.length < total.value)

async function fetchCommentLikeStatus(ids: number[]) {
  auth.hydrate()
  if (!auth.isLoggedIn.value || !ids.length)
    return
  try {
    const data = await batchGetCommentLikeStatus(ids)
    for (const item of data.items)
      likeStatusMap.value[item.comment_id] = item.liked
  }
  catch (e) {
    console.error(e)
  }
}

async function fetchComments(reset = false) {
  if (reset) {
    page.value = 1
    loading.value = true
  }
  else {
    loadingMore.value = true
  }

  try {
    const data = await getArticleComments({
      article_id: props.articleId,
      page: page.value,
      page_size: COMMENT_PAGE_SIZE,
      order_by: orderBy.value,
    })
    if (reset)
      comments.value = data.comments
    else
      comments.value.push(...data.comments)
    total.value = data.total
    await fetchCommentLikeStatus(data.comments.map(c => c.id))
  }
  catch (e) {
    if (reset)
      comments.value = []
    console.error(e)
  }
  finally {
    loading.value = false
    loadingMore.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value)
    return
  page.value += 1
  await fetchComments(false)
}

async function switchOrder(next: 'time' | 'hot') {
  if (orderBy.value === next)
    return
  orderBy.value = next
  await fetchComments(true)
}

function requireLogin(): boolean {
  auth.hydrate()
  if (auth.isLoggedIn.value)
    return true
  navigateTo({ path: '/auth/login', query: { redirect: useRoute().fullPath } })
  return false
}

async function submitComment() {
  const text = content.value.trim()
  if (!text)
    return
  if (!requireLogin() || !auth.user.value)
    return

  submitting.value = true
  try {
    await createComment({
      article_id: props.articleId,
      user_id: auth.user.value.id,
      content: text,
    })
    content.value = ''
    await fetchComments(true)
    emit('countChange', 1)
  }
  catch (e) {
    alert(e instanceof Error ? e.message : '评论失败')
  }
  finally {
    submitting.value = false
  }
}

function onCommentDeleted(id: number) {
  comments.value = comments.value.filter(c => c.id !== id)
  total.value = Math.max(0, total.value - 1)
  emit('countChange', -1)
}

onMounted(() => {
  auth.hydrate()
  fetchComments(true)
})

watch(() => props.articleId, () => fetchComments(true))
</script>

<template>
  <section id="comments" class="comment-section card">
    <header class="comment-section__header">
      <h2 class="comment-section__title">
        评论
        <span v-if="total > 0" class="comment-section__count">{{ total }}</span>
      </h2>

      <div class="comment-section__tabs" role="tablist" aria-label="评论排序">
        <button
          type="button"
          role="tab"
          class="comment-section__tab"
          :class="{ 'comment-section__tab--active': orderBy === 'time' }"
          :aria-selected="orderBy === 'time'"
          @click="switchOrder('time')"
        >
          最新
        </button>
        <button
          type="button"
          role="tab"
          class="comment-section__tab"
          :class="{ 'comment-section__tab--active': orderBy === 'hot' }"
          :aria-selected="orderBy === 'hot'"
          @click="switchOrder('hot')"
        >
          最热
        </button>
      </div>
    </header>

    <!-- 发表评论 -->
    <div class="comment-section__composer">
      <template v-if="auth.isLoggedIn.value">
        <UserAvatar
          :src="avatarUrl"
          :name="displayName"
          :size="36"
          class="comment-section__avatar"
        />
        <div class="comment-section__input-wrap">
          <textarea
            v-model="content"
            class="comment-section__textarea"
            placeholder="说点什么..."
            rows="2"
            maxlength="500"
          />
          <div class="comment-section__input-actions">
            <span class="comment-section__hint">{{ content.length }}/500</span>
            <button
              type="button"
              class="comment-section__submit"
              :disabled="!content.trim() || submitting"
              @click="submitComment"
            >
              {{ submitting ? '发送中...' : '发表评论' }}
            </button>
          </div>
        </div>
      </template>
      <div v-else class="comment-section__login-tip">
        <NuxtLink :to="{ path: '/auth/login', query: { redirect: $route.fullPath } }" class="comment-section__login-link">
          登录
        </NuxtLink>
        后参与评论
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="loading" class="comment-section__status">
      加载评论中...
    </div>

    <div v-else-if="!comments.length" class="comment-section__status">
      暂无评论，来抢沙发吧~
    </div>

    <div v-else class="comment-section__list">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-id="articleId"
        :like-status="likeStatusMap[comment.id]"
        @deleted="onCommentDeleted"
        @count-change="emit('countChange', $event)"
      />
    </div>

    <button
      v-if="hasMore && !loading"
      type="button"
      class="comment-section__load-more"
      :disabled="loadingMore"
      @click="loadMore"
    >
      {{ loadingMore ? '加载中...' : `查看更多评论（${comments.length}/${total}）` }}
    </button>
  </section>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.comment-section {
  margin-top: 1.25rem;
  padding: 1.5rem 1.75rem;
  border-radius: 22px;
  scroll-margin-top: 6rem;
}

.comment-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.comment-section__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
}

.comment-section__count {
  margin-left: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
}

.comment-section__tabs {
  display: flex;
  gap: 0.35rem;
  padding: 0.2rem;
  border-radius: 999px;
  background: rgb(0 0 0 / 4%);
}

.comment-section__tab {
  padding: 0.3rem 0.85rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.comment-section__tab--active {
  background: #fff;
  color: var(--home-accent-dark);
  box-shadow: 0 1px 4px rgb(0 0 0 / 8%);
}

.comment-section__composer {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgb(0 0 0 / 6%);
}

.comment-section__avatar {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  object-fit: cover;
}

.comment-section__avatar--placeholder {
  display: grid;
  place-items: center;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.875rem;
  font-weight: 600;
}

.comment-section__input-wrap {
  flex: 1;
  min-width: 0;
}

.comment-section__textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 12px;
  background: rgb(255 255 255 / 80%);
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

.comment-section__textarea:focus {
  border-color: var(--home-accent);
}

.comment-section__input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.comment-section__hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.comment-section__submit {
  padding: 0.45rem 1.1rem;
  border: none;
  border-radius: 999px;
  background: var(--home-accent);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.comment-section__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-section__login-tip {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgb(0 0 0 / 3%);
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.comment-section__login-link {
  color: var(--home-accent-dark);
  font-weight: 600;
  text-decoration: none;
}

.comment-section__login-link:hover {
  color: var(--home-accent);
}

.comment-section__status {
  padding: 2rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

.comment-section__load-more {
  display: block;
  width: 100%;
  margin-top: 1.25rem;
  padding: 0.65rem;
  border: none;
  border-radius: 12px;
  background: rgb(0 0 0 / 4%);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--home-accent-dark);
  cursor: pointer;
  transition: background 0.15s;
}

.comment-section__load-more:hover:not(:disabled) {
  background: rgb(0 0 0 / 7%);
}

.comment-section__load-more:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 960px) {
  .comment-section {
    padding: 1.25rem 1.15rem;
  }
}
</style>
