<script setup lang="ts">
import ChinaMap from '~/components/life/ChinaMap.vue'
import ProvinceHoverPanels from '~/components/life/ProvinceHoverPanels.vue'
import { getProvinceLife, visitedProvinceCount } from '~/data/lifeProvinces'
import type { LifeNote } from '~/data/lifeProvinces'

definePageMeta({ layout: 'home' })

useSeoMeta({ title: '生活专栏 · Chenaqi Blog' })

const hoveredAdcode = ref<string | null>(null)
const hoveredName = ref('')
const focusedNote = ref<LifeNote | null>(null)

const hoveredLife = computed(() =>
  hoveredAdcode.value ? getProvinceLife(hoveredAdcode.value, hoveredName.value) : null,
)

const panelVisible = computed(() => hoveredAdcode.value !== null)

function handleProvinceHover(adcode: string, name: string) {
  hoveredAdcode.value = adcode
  hoveredName.value = name
  focusedNote.value = null
}

function handleProvinceLeave() {
  hoveredAdcode.value = null
  hoveredName.value = ''
  focusedNote.value = null
}

function handleProvinceSelect(adcode: string, name: string) {
  if (hoveredAdcode.value === adcode) {
    hoveredAdcode.value = null
    hoveredName.value = ''
    focusedNote.value = null
    return
  }
  hoveredAdcode.value = adcode
  hoveredName.value = name
  focusedNote.value = null
}

function handlePhotoClick(noteIndex: number) {
  const life = hoveredLife.value
  if (!life?.notes.length)
    return
  focusedNote.value = life.notes[noteIndex] ?? life.notes[0] ?? null
}

function handleNoteClick(note: LifeNote) {
  focusedNote.value = note
}

function closeNoteDetail() {
  focusedNote.value = null
}
</script>

<template>
  <div class="life-page">
    <aside class="life-page__rail life-page__rail--left">
      <div class="life-page__brand" :class="{ 'life-page__brand--hidden': panelVisible }">
        <p class="life-page__eyebrow">Life · Travel</p>
        <h1 class="life-page__title">生活专栏</h1>
        <p class="life-page__count">
          <span class="life-page__count-num">{{ visitedProvinceCount }}</span>
          个省份已有足迹
        </p>
      </div>

      <ProvinceHoverPanels
        side="left"
        :life="hoveredLife"
        :visible="panelVisible"
        :focused-note="focusedNote"
        @note-click="handleNoteClick"
      />
    </aside>

    <main class="life-page__map">
      <ClientOnly>
        <ChinaMap
          :hovered-adcode="hoveredAdcode"
          :active-photos="hoveredLife?.photos ?? []"
          @hover="handleProvinceHover"
          @leave="handleProvinceLeave"
          @select="handleProvinceSelect"
          @photo-click="handlePhotoClick"
        />
        <template #fallback>
          <div class="life-page__map-skeleton" aria-hidden="true" />
        </template>
      </ClientOnly>
    </main>

    <aside class="life-page__rail life-page__rail--right">
      <div v-if="!panelVisible" class="life-page__hint">
        <span class="life-page__hint-line" />
        <p>悬停省份<br>探索旅途</p>
        <span class="life-page__hint-line" />
      </div>

      <ProvinceHoverPanels
        side="right"
        :life="hoveredLife"
        :visible="panelVisible"
        :focused-note="focusedNote"
        @note-click="handleNoteClick"
      />
    </aside>

    <Teleport to="body">
      <Transition name="life-note-modal">
        <div
          v-if="focusedNote"
          class="life-note-modal"
          role="dialog"
          aria-modal="true"
          :aria-label="focusedNote.title"
          @click.self="closeNoteDetail"
        >
          <article class="life-note-modal__card">
            <button
              type="button"
              class="life-note-modal__close"
              aria-label="关闭"
              @click="closeNoteDetail"
            >
              ×
            </button>
            <time v-if="focusedNote.date" class="life-note-modal__date">{{ focusedNote.date }}</time>
            <h2 class="life-note-modal__title">{{ focusedNote.title }}</h2>
            <p class="life-note-modal__content">{{ focusedNote.content }}</p>
          </article>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.life-page {
  display: grid;
  grid-template-columns: minmax(10rem, 13rem) minmax(0, 1fr) minmax(10rem, 13rem);
  align-items: center;
  gap: clamp(0.75rem, 2vw, 2rem);
  width: 100%;
  min-height: calc(100vh - 9rem);
  margin: 0;
  padding: 0;
}

.life-page__rail {
  position: relative;
  align-self: center;
  min-height: 12rem;
}

.life-page__rail--left {
  justify-self: end;
  width: 100%;
}

.life-page__rail--right {
  justify-self: start;
  width: 100%;
}

.life-page__brand {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.life-page__brand--hidden {
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
  position: absolute;
  inset: 0 auto auto 0;
}

.life-page__eyebrow {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9ca3af;
}

.life-page__title {
  margin: 0;
  font-size: clamp(1.15rem, 1.6vw, 1.45rem);
  font-weight: 700;
  color: #374151;
  line-height: 1.2;
  letter-spacing: 0.04em;
}

.life-page__count {
  margin: 0.5rem 0 0;
  font-size: 0.72rem;
  line-height: 1.5;
  color: #9ca3af;
}

.life-page__count-num {
  display: block;
  margin-bottom: 0.1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #6b7280;
  line-height: 1;
}

.life-page__map {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.life-page__map-skeleton {
  width: 100%;
  aspect-ratio: 900 / 760;
  border-radius: 8px;
  background: linear-gradient(135deg, #f3f0ec, #ebe7e2);
  animation: life-map-pulse 1.4s ease-in-out infinite;
}

@keyframes life-map-pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 0.9;
  }
}

.life-page__hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  text-align: center;
  color: #c4c9d0;
  transition: opacity 0.25s ease;
}

.life-page__hint p {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.7;
  letter-spacing: 0.12em;
  writing-mode: vertical-rl;
}

.life-page__hint-line {
  display: block;
  width: 1px;
  height: 2.5rem;
  background: linear-gradient(to bottom, transparent, #d8dce2, transparent);
}

.life-note-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgb(15 23 42 / 30%);
  backdrop-filter: blur(6px);
}

.life-note-modal__card {
  position: relative;
  width: min(28rem, 100%);
  padding: 1.5rem 1.6rem;
  border-radius: 16px;
  background: rgb(255 255 255 / 96%);
  border: 1px solid rgb(255 255 255 / 90%);
  box-shadow: 0 24px 60px rgb(15 23 42 / 12%);
}

.life-note-modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.85rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
}

.life-note-modal__date {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #9ca3af;
}

.life-note-modal__title {
  margin: 0.35rem 0 0.75rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.35;
}

.life-note-modal__content {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.75;
  color: #4b5563;
}

.life-note-modal-enter-active,
.life-note-modal-leave-active {
  transition: opacity 0.2s ease;
}

.life-note-modal-enter-active .life-note-modal__card,
.life-note-modal-leave-active .life-note-modal__card {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.life-note-modal-enter-from,
.life-note-modal-leave-to {
  opacity: 0;
}

.life-note-modal-enter-from .life-note-modal__card,
.life-note-modal-leave-to .life-note-modal__card {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 960px) {
  .life-page {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 1rem;
    min-height: auto;
  }

  .life-page__rail--left,
  .life-page__rail--right {
    min-height: auto;
  }

  .life-page__brand--hidden {
    position: static;
    display: none;
  }

  .life-page__hint {
    display: none;
  }

  .life-page__map {
    order: -1;
  }
}
</style>

<style>
.home-layout--subpage .home-shell__main:has(.life-page) {
  max-width: none;
  padding: 4.5rem 1.25rem 2rem;
}
</style>
