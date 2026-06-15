<script setup lang="ts">
import type { ProvinceSelectPayload } from '~/components/life/LifeChinaMap.vue'

definePageMeta({ layout: 'life' })

useSeoMeta({ title: '生活小记 · Chenaqi Blog' })

const selection = ref<ProvinceSelectPayload | null>(null)

function onProvinceSelect(payload: ProvinceSelectPayload | null) {
  selection.value = payload
}
</script>

<template>
  <div class="life-page">
    <div class="life-page__decor" aria-hidden="true">
      <span class="life-page__cloud life-page__cloud--1" />
      <span class="life-page__cloud life-page__cloud--2" />
      <span class="life-page__cloud life-page__cloud--3" />
      <span class="life-page__star life-page__star--1">✦</span>
      <span class="life-page__star life-page__star--2">✧</span>
      <span class="life-page__star life-page__star--3">✦</span>
    </div>

    <ClientOnly>
      <LifePhotoPanels :selection="selection" />
      <div class="life-page__map-wrap">
        <LifeChinaMap @select="onProvinceSelect" />
      </div>
      <template #fallback>
        <div class="life-page__loading">
          <span class="life-page__loading-dot" />
          <span class="life-page__loading-dot" />
          <span class="life-page__loading-dot" />
          <p>地图加载中…</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.life-page {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}

.life-page__decor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.life-page__cloud {
  position: absolute;
  background: rgb(255 255 255 / 72%);
  border-radius: 999px;
  filter: blur(1px);
  animation: life-float 9s ease-in-out infinite;
}

.life-page__cloud--1 {
  width: 120px;
  height: 44px;
  top: 12%;
  left: 8%;
  box-shadow:
    34px 8px 0 -4px rgb(255 255 255 / 72%),
    -28px 10px 0 -6px rgb(255 255 255 / 65%);
}

.life-page__cloud--2 {
  width: 90px;
  height: 34px;
  top: 22%;
  right: 10%;
  animation-delay: -3s;
  box-shadow:
    24px 6px 0 -4px rgb(255 255 255 / 70%),
    -20px 8px 0 -5px rgb(255 255 255 / 60%);
}

.life-page__cloud--3 {
  width: 100px;
  height: 38px;
  bottom: 18%;
  left: 14%;
  animation-delay: -5s;
  box-shadow:
    28px 7px 0 -4px rgb(255 255 255 / 68%),
    -22px 9px 0 -5px rgb(255 255 255 / 58%);
}

.life-page__star {
  position: absolute;
  color: rgb(255 255 255 / 85%);
  font-size: 1.1rem;
  animation: life-twinkle 2.4s ease-in-out infinite;
}

.life-page__star--1 {
  top: 18%;
  right: 22%;
}

.life-page__star--2 {
  top: 32%;
  left: 18%;
  animation-delay: -0.8s;
}

.life-page__star--3 {
  bottom: 24%;
  right: 16%;
  animation-delay: -1.4s;
}

.life-page__map-wrap {
  position: fixed;
  inset: 0;
  z-index: 10;
  padding: 1rem 0;
}

.life-page__loading {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #6b5b7b;
  font-weight: 600;
}

.life-page__loading-dot {
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  margin: 0 0.2rem;
  border-radius: 50%;
  background: #ff8fab;
  animation: life-bounce 0.9s ease-in-out infinite;
}

.life-page__loading-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.life-page__loading-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes life-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes life-twinkle {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes life-bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@media (max-width: 960px) {
  .life-page__map-wrap {
    padding-top: 5.5rem;
  }
}
</style>
