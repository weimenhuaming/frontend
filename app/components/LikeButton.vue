<script setup lang="ts">
import type { LikeTargetType } from '~/composables/useLikeToggle'

const props = withDefaults(defineProps<{
  type: LikeTargetType
  targetId: number
  initialCount: number
  initialLiked?: boolean
  variant?: 'float' | 'inline'
}>(), {
  variant: 'inline',
})

const likeState = useLikeToggle({
  type: props.type,
  id: () => props.targetId,
  initialCount: () => props.initialCount,
  initialLiked: () => props.initialLiked,
})

const liked = computed(() => likeState.liked.value)
const likeCount = computed(() => likeState.likeCount.value)
const syncing = computed(() => likeState.syncing.value)
const toggle = likeState.toggle
</script>

<template>
  <button
    type="button"
    class="like-btn"
    :class="{
      'like-btn--float': variant === 'float',
      'like-btn--inline': variant === 'inline',
      'like-btn--active': liked,
      'like-btn--syncing': syncing,
    }"
    :aria-pressed="liked"
    :aria-label="liked ? '取消点赞' : '点赞'"
    @click="toggle"
  >
    <span
      v-if="likeCount > 0 || variant === 'float'"
      class="like-btn__count"
      :class="{ 'like-btn__count--active': liked }"
    >
      {{ likeCount }}
    </span>
    <span class="like-btn__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.like-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.like-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.like-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.like-btn--syncing {
  opacity: 0.75;
}

.like-btn__icon {
  display: flex;
  color: #fecdd3;
  transition: color 0.15s;
}

.like-btn--active .like-btn__icon {
  color: #fb7185;
}

.like-btn__icon svg {
  width: 1rem;
  height: 1rem;
}

.like-btn--float {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.like-btn--float .like-btn__icon svg {
  width: 1.55rem;
  height: 1.55rem;
}

.like-btn--inline .like-btn__icon svg {
  width: 0.9rem;
  height: 0.9rem;
}

.like-btn__count {
  font-size: 0.75rem;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  transition: color 0.15s;
}

.like-btn--inline .like-btn__count {
  margin-right: 0.25rem;
}

.like-btn__count--active {
  color: #fb7185;
}

.like-btn--float .like-btn__count {
  position: absolute;
  top: -0.35rem;
  left: calc(100% - 0.75rem);
  min-width: 1.5rem;
  margin-right: 0;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: #d1d5db;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}

.like-btn--float .like-btn__count--active {
  background: #fb7185;
  color: #fff;
}
</style>
