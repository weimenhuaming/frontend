<script setup lang="ts">
const ENDPOINT = 'https://blog-liker.yysuni1001.workers.dev/api/like'
const SLUG = 'chenaqi-blog'

const liked = ref(false)
const justLiked = ref(false)
const count = ref<number | null>(null)
const particles = ref<Array<{ id: number, x: number, y: number }>>([])

let justLikedTimer: ReturnType<typeof setTimeout> | null = null

async function fetchCount() {
  try {
    const res = await fetch(`${ENDPOINT}?slug=${encodeURIComponent(SLUG)}`, { cache: 'no-store' })
    if (!res.ok)
      return
    const data = await res.json().catch(() => ({}))
    if (typeof data?.count === 'number')
      count.value = data.count
  }
  catch {
    // ignore
  }
}

async function handleLike() {
  liked.value = true
  justLiked.value = true

  if (justLikedTimer)
    clearTimeout(justLikedTimer)
  justLikedTimer = setTimeout(() => {
    justLiked.value = false
  }, 600)

  particles.value = Array.from({ length: 6 }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * 60 - 30,
    y: Math.random() * 60 - 30,
  }))
  setTimeout(() => {
    particles.value = []
  }, 1000)

  try {
    const res = await fetch(`${ENDPOINT}?slug=${encodeURIComponent(SLUG)}`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    const value = typeof data?.count === 'number' ? data.count : (count.value ?? 0) + 1
    count.value = value
  }
  catch {
    // ignore
  }
}

onMounted(() => {
  fetchCount()
})

onUnmounted(() => {
  if (justLikedTimer)
    clearTimeout(justLikedTimer)
})
</script>

<template>
  <button
    type="button"
    class="home-like card heartbeat-container"
    aria-label="点赞"
    @click="handleLike"
  >
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="home-like__particle"
      :style="{ '--px': `${particle.x}px`, '--py': `${particle.y}px` }"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </span>

    <span
      v-if="typeof count === 'number'"
      class="home-like__count"
      :class="{ 'home-like__count--liked': liked }"
    >
      {{ count.toLocaleString() }}
    </span>

    <span
      class="home-like__heart"
      :class="{ 'home-like__heart--bounce': justLiked, 'home-like__heart--liked': liked }"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.home-like {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  padding: 0.75rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  overflow: visible;
  transition: transform 0.15s;
}

.home-like:hover {
  transform: scale(1.05);
}

.home-like:active {
  transform: scale(0.95);
}

.home-like__heart {
  display: flex;
  color: #fecdd3;
}

.home-like__heart svg {
  width: 1.75rem;
  height: 1.75rem;
}

.home-like__heart--liked {
  color: #fb7185;
}

.home-like__heart--bounce {
  animation: like-bounce 0.6s ease-out;
}

.home-like__count {
  position: absolute;
  top: -0.4rem;
  left: calc(100% - 0.75rem);
  min-width: 1.5rem;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: #d1d5db;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.home-like__count--liked {
  background: #fb7185;
}

.home-like__particle {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fb7185;
  pointer-events: none;
  animation: particle-fly 0.8s ease-out forwards;
}

.home-like__particle svg {
  width: 0.75rem;
  height: 0.75rem;
}

.heartbeat-container:hover .home-like__heart:not(.home-like__heart--bounce) {
  animation: heartbeat-frame 0.8s ease-in-out;
}

@keyframes heartbeat-frame {
  0%,
  100% {
    transform: scale(1);
  }

  20%,
  60% {
    transform: scale(1.15);
  }

  40%,
  80% {
    transform: scale(1);
  }
}

@keyframes like-bounce {
  0% {
    transform: scale(1) rotate(0deg);
  }

  30% {
    transform: scale(1.4) rotate(-10deg);
  }

  60% {
    transform: scale(1.2) rotate(10deg);
  }

  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes particle-fly {
  0% {
    opacity: 1;
    transform: scale(0) translate(0, 0);
  }

  50% {
    opacity: 1;
    transform: scale(1.2) translate(var(--px), var(--py));
  }

  100% {
    opacity: 0;
    transform: scale(0.8) translate(calc(var(--px) * 1.2), calc(var(--py) * 1.2));
  }
}
</style>
