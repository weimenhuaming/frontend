<script setup lang="ts">
import { getLifeEntry } from '~/utils/life-mock'
import type { ProvinceSelectPayload } from '~/components/life/LifeChinaMap.vue'

interface PanelPhoto {
  url: string
  caption: string
  side: 'left' | 'right'
  top: string
  rotate: string
}

interface ConnectorLine {
  id: string
  d: string
}

const props = defineProps<{
  selection: ProvinceSelectPayload | null
}>()

const cardRefs = ref<(HTMLElement | null)[]>([])
const lines = ref<ConnectorLine[]>([])

const entry = computed(() =>
  props.selection ? getLifeEntry(props.selection.name) : null,
)

const panelPhotos = computed<PanelPhoto[]>(() => {
  if (!entry.value)
    return []

  return entry.value.photos.slice(0, 4).map((photo, index) => ({
    ...photo,
    side: index % 2 === 0 ? 'left' : 'right',
    top: `${14 + index * 20}%`,
    rotate: index % 2 === 0 ? `${-4 + index * 2}deg` : `${4 - index * 2}deg`,
  }))
})

function setCardRef(el: Element | ComponentPublicInstance | null, index: number) {
  cardRefs.value[index] = el instanceof HTMLElement ? el : null
}

function buildCurve(fromX: number, fromY: number, toX: number, toY: number, side: 'left' | 'right') {
  const bend = side === 'left' ? -90 : 90
  const midX = (fromX + toX) / 2 + bend
  const midY = (fromY + toY) / 2 - 30
  return `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`
}

function updateLines() {
  if (!props.selection) {
    lines.value = []
    return
  }

  const anchor = props.selection
  const nextLines: ConnectorLine[] = []

  panelPhotos.value.forEach((photo, index) => {
    const card = cardRefs.value[index]
    if (!card)
      return

    const rect = card.getBoundingClientRect()
    const toX = photo.side === 'left' ? rect.right - 8 : rect.left + 8
    const toY = rect.top + rect.height * 0.38

    nextLines.push({
      id: `${photo.side}-${index}`,
      d: buildCurve(anchor.x, anchor.y, toX, toY, photo.side),
    })
  })

  lines.value = nextLines
}

watch(
  () => [props.selection, panelPhotos.value.length] as const,
  async () => {
    await nextTick()
    updateLines()
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('resize', updateLines)
  window.addEventListener('scroll', updateLines, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLines)
  window.removeEventListener('scroll', updateLines)
})
</script>

<template>
  <div class="life-panels" :class="{ 'life-panels--active': !!selection }">
    <svg v-if="selection && lines.length" class="life-panels__svg" aria-hidden="true">
      <defs>
        <linearGradient id="life-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff8fab" />
          <stop offset="100%" stop-color="#c4b5fd" />
        </linearGradient>
      </defs>
      <path
        v-for="line in lines"
        :key="line.id"
        :d="line.d"
        class="life-panels__path"
      />
      <circle
        :cx="selection!.x"
        :cy="selection!.y"
        r="7"
        class="life-panels__dot"
      />
      <circle
        :cx="selection!.x"
        :cy="selection!.y"
        r="14"
        class="life-panels__dot-ring"
      />
    </svg>

    <Transition name="life-panel-fade">
      <div v-if="selection && entry" class="life-panels__info">
        <p class="life-panels__info-kicker">✿ 生活小记</p>
        <h2 class="life-panels__info-title">{{ entry.title }}</h2>
        <p class="life-panels__info-note">{{ entry.note }}</p>
      </div>
    </Transition>

    <TransitionGroup name="life-photo">
      <article
        v-for="(photo, index) in panelPhotos"
        :key="`${selection?.name}-${index}`"
        :ref="(el) => setCardRef(el, index)"
        class="life-panels__card"
        :class="`life-panels__card--${photo.side}`"
        :style="{ top: photo.top, transform: `rotate(${photo.rotate})` }"
      >
        <div class="life-panels__polaroid">
          <img
            :src="photo.url"
            :alt="photo.caption"
            loading="lazy"
            decoding="async"
          >
          <p class="life-panels__caption">{{ photo.caption }}</p>
        </div>
      </article>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.life-panels {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.life-panels__svg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: visible;
  pointer-events: none;
}

.life-panels__path {
  fill: none;
  stroke: url(#life-line-gradient);
  stroke-width: 2.5;
  stroke-dasharray: 8 6;
  stroke-linecap: round;
  opacity: 0.85;
  animation: life-dash 1.2s linear infinite;
}

.life-panels__dot {
  fill: #ff6b9d;
  stroke: #fff;
  stroke-width: 3;
}

.life-panels__dot-ring {
  fill: rgb(255 143 171 / 25%);
  stroke: rgb(255 143 171 / 50%);
  stroke-width: 2;
  animation: life-pulse 1.8s ease-in-out infinite;
}

.life-panels__info {
  position: fixed;
  top: 5.5rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  max-width: min(90vw, 28rem);
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 78%);
  backdrop-filter: blur(12px);
  border: 2px solid rgb(255 255 255 / 90%);
  box-shadow: 0 8px 28px var(--life-shadow);
  pointer-events: none;
}

.life-panels__info-kicker {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #ff8fab;
}

.life-panels__info-title {
  margin: 0.15rem 0 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #5a4a6a;
}

.life-panels__info-note {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: #8b7a96;
  line-height: 1.5;
}

.life-panels__card {
  position: fixed;
  width: min(11.5rem, 22vw);
  pointer-events: auto;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.life-panels__card--left {
  left: clamp(0.75rem, 2.5vw, 2rem);
}

.life-panels__card--right {
  right: clamp(0.75rem, 2.5vw, 2rem);
}

.life-panels__card:hover {
  transform: rotate(0deg) scale(1.04) !important;
  z-index: 2;
}

.life-panels__polaroid {
  background: #fff;
  padding: 0.55rem 0.55rem 0.75rem;
  border-radius: 14px;
  border: 3px solid #fff;
  box-shadow:
    0 10px 30px rgb(255 143 171 / 28%),
    0 0 0 1px rgb(255 143 171 / 15%);
}

.life-panels__polaroid img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  background: #ffe4ec;
}

.life-panels__caption {
  margin: 0.45rem 0 0;
  font-size: 0.78rem;
  font-weight: 700;
  color: #6b5b7b;
  text-align: center;
}

.life-photo-enter-active,
.life-photo-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.life-photo-enter-from,
.life-photo-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.92) !important;
}

.life-panel-fade-enter-active,
.life-panel-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.life-panel-fade-enter-from,
.life-panel-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

@keyframes life-dash {
  to {
    stroke-dashoffset: -28;
  }
}

@keyframes life-pulse {
  0%,
  100% {
    opacity: 0.55;
    r: 14;
  }

  50% {
    opacity: 0.9;
    r: 18;
  }
}

@media (max-width: 960px) {
  .life-panels__card {
    width: min(9rem, 28vw);
  }

  .life-panels__info {
    top: 6.75rem;
    border-radius: 18px;
  }

  .life-panels__path {
    stroke-width: 2;
  }
}

@media (max-width: 640px) {
  .life-panels__card--left {
    left: 0.35rem;
  }

  .life-panels__card--right {
    right: 0.35rem;
  }

  .life-panels__card {
    width: min(7.5rem, 34vw);
  }
}
</style>
