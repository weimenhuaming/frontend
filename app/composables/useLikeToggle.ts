import {
  batchGetCommentLikeStatus,
  getArticleLikeStatus,
  likeArticle,
  likeComment,
  unlikeArticle,
  unlikeComment,
} from '~/api/interaction'

export type LikeTargetType = 'article' | 'comment'

function isAlreadyLikedError(message: string) {
  return message.includes('已经点过赞') || message.includes('已点赞')
}

function isNotLikedError(message: string) {
  return message.includes('还没点') || message.includes('未点赞') || message.includes('没有点赞')
}

export function useLikeToggle(options: {
  type: LikeTargetType
  id: MaybeRefOrGetter<number>
  initialCount: MaybeRefOrGetter<number>
  initialLiked?: MaybeRefOrGetter<boolean | undefined>
}) {
  const auth = useAuth()

  const liked = ref(false)
  const likeCount = ref(0)
  const syncing = ref(false)
  const statusReady = ref(false)

  let fetchGeneration = 0
  let hasToggled = false

  function setLiked(value: boolean) {
    liked.value = value
  }

  function setCount(count: number) {
    likeCount.value = Math.max(0, count)
  }

  async function fetchLikeStatus() {
    if (import.meta.server || syncing.value)
      return

    auth.hydrate()
    if (!auth.isLoggedIn.value) {
      setLiked(false)
      statusReady.value = true
      return
    }

    const id = toValue(options.id)
    if (!id)
      return

    const generation = ++fetchGeneration

    try {
      if (options.type === 'article') {
        const data = await getArticleLikeStatus(id)
        if (generation !== fetchGeneration || syncing.value)
          return
        setLiked(data.liked)
      }
      else {
        const data = await batchGetCommentLikeStatus([id])
        if (generation !== fetchGeneration || syncing.value)
          return
        const item = data.items.find(i => i.comment_id === id)
        setLiked(item?.liked ?? false)
      }
      statusReady.value = true
    }
    catch (e) {
      console.error(e)
    }
  }

  watch(
    () => toValue(options.initialCount),
    (count) => {
      if (!syncing.value)
        setCount(count)
    },
    { immediate: true },
  )

  watch(
    () => toValue(options.initialLiked),
    (value) => {
      if (typeof value !== 'boolean' || syncing.value || hasToggled)
        return
      setLiked(value)
      statusReady.value = true
    },
    { immediate: true },
  )

  watch(
    () => [toValue(options.id), auth.user.value?.id] as const,
    () => {
      if (options.type === 'comment' && typeof toValue(options.initialLiked) === 'boolean')
        return
      statusReady.value = false
      fetchLikeStatus()
    },
    { immediate: true },
  )

  onMounted(() => {
    auth.hydrate()
    if (options.type === 'article' || typeof toValue(options.initialLiked) !== 'boolean')
      fetchLikeStatus()
  })

  async function toggle() {
    auth.hydrate()
    if (!auth.isLoggedIn.value) {
      navigateTo({ path: '/auth/login', query: { redirect: useRoute().fullPath } })
      return
    }
    if (syncing.value)
      return

    const id = toValue(options.id)
    if (!id)
      return

    if (!statusReady.value)
      await fetchLikeStatus()

    const shouldLike = !liked.value
    fetchGeneration++
    syncing.value = true

    try {
      const data = shouldLike
        ? (options.type === 'article' ? await likeArticle(id) : await likeComment(id))
        : (options.type === 'article' ? await unlikeArticle(id) : await unlikeComment(id))

      hasToggled = true
      setLiked(shouldLike)
      setCount(data.like_count)
    }
    catch (e) {
      const message = e instanceof Error ? e.message : String(e)

      if (shouldLike && isAlreadyLikedError(message)) {
        hasToggled = true
        setLiked(true)
        await fetchLikeStatus()
      }
      else if (!shouldLike && isNotLikedError(message)) {
        hasToggled = true
        setLiked(false)
        await fetchLikeStatus()
      }
      else {
        console.error(e)
      }
    }
    finally {
      syncing.value = false
    }
  }

  return {
    liked,
    likeCount,
    syncing,
    toggle,
  }
}
