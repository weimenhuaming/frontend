<script setup lang="ts">
import type { LifeNote, ProvinceLife } from '~/data/lifeProvinces'
import { hasProvinceLife } from '~/data/lifeProvinces'

const props = defineProps<{
  side: 'left' | 'right'
  life: ProvinceLife | null
  visible: boolean
  focusedNote?: LifeNote | null
}>()

const emit = defineEmits<{
  noteClick: [note: LifeNote]
}>()
</script>

<template>
  <Transition :name="side === 'left' ? 'life-side-left' : 'life-side-right'">
    <aside
      v-if="visible && life && side === 'left'"
      class="life-panel life-panel--left"
    >
      <p class="life-panel__eyebrow">{{ life.name }}</p>
      <h2 class="life-panel__title">{{ life.subtitle }}</h2>

      <section class="life-panel__section">
        <h3 class="life-panel__label">景点</h3>
        <ul class="life-panel__list">
          <li
            v-for="spot in life.attractions"
            :key="spot"
            class="life-panel__list-item"
          >
            {{ spot }}
          </li>
        </ul>
      </section>

      <section v-if="life.notes.length" class="life-panel__section">
        <h3 class="life-panel__label">笔记</h3>
        <article
          v-for="note in life.notes.slice(0, 2)"
          :key="note.title"
          class="life-panel__note"
          :class="{ 'life-panel__note--active': focusedNote?.title === note.title }"
          role="button"
          tabindex="0"
          @click="emit('noteClick', note)"
          @keydown.enter="emit('noteClick', note)"
        >
          <time v-if="note.date" class="life-panel__note-date">{{ note.date }}</time>
          <h4 class="life-panel__note-title">{{ note.title }}</h4>
          <p class="life-panel__note-content">{{ note.content }}</p>
        </article>
      </section>

      <p v-if="!hasProvinceLife(life.adcode)" class="life-panel__hint">
        待探索
      </p>
    </aside>

    <aside
      v-else-if="visible && life && side === 'right'"
      class="life-panel life-panel--right"
    >
      <h3 class="life-panel__label">影像</h3>
      <div class="life-panel__photos">
        <figure
          v-for="(item, index) in life.photos"
          :key="item.url"
          class="life-panel__photo"
          :style="{ '--delay': `${index * 0.07}s` }"
          role="button"
          tabindex="0"
          @click="life.notes[0] && emit('noteClick', life.notes[0])"
          @keydown.enter="life.notes[0] && emit('noteClick', life.notes[0])"
        >
          <img :src="item.url" :alt="item.caption" loading="lazy">
          <figcaption>{{ item.caption }}</figcaption>
        </figure>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.life-panel {
  width: 100%;
}

.life-panel__eyebrow {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9ca3af;
}

.life-panel__title {
  margin: 0.25rem 0 0.9rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  line-height: 1.45;
}

.life-panel__section + .life-panel__section {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgb(209 213 219 / 50%);
}

.life-panel__label {
  margin: 0 0 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

.life-panel__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.life-panel__list-item {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.5;
  padding-left: 0.65rem;
  position: relative;
}

.life-panel__list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #c4c9d0;
}

.life-panel__note {
  cursor: pointer;
  border-radius: 8px;
  padding: 0.4rem 0.45rem;
  margin: 0 -0.45rem;
  transition: background 0.15s ease;
}

.life-panel__note:hover,
.life-panel__note--active {
  background: rgb(243 244 246 / 80%);
}

.life-panel__note + .life-panel__note {
  margin-top: 0.35rem;
}

.life-panel__note-date {
  display: block;
  font-size: 0.62rem;
  font-weight: 500;
  color: #9ca3af;
}

.life-panel__note-title {
  margin: 0.12rem 0 0.2rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.life-panel__note-content {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.55;
  color: #9ca3af;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.life-panel__hint {
  margin: 0.75rem 0 0;
  font-size: 0.65rem;
  color: #d1d5db;
}

.life-panel__photos {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.life-panel__photo {
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: life-photo-in 0.35s ease both;
  animation-delay: var(--delay);
}

.life-panel__photo:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgb(55 65 81 / 10%);
}

.life-panel__photo img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.life-panel__photo figcaption {
  padding: 0.4rem 0.5rem;
  font-size: 0.68rem;
  color: #9ca3af;
  line-height: 1.4;
}

.life-side-left-enter-active,
.life-side-left-leave-active,
.life-side-right-enter-active,
.life-side-right-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.life-side-left-enter-from,
.life-side-left-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.life-side-right-enter-from,
.life-side-right-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

@keyframes life-photo-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
