<script setup lang="ts">
const track = {
  title: 'Close To You',
  artist: 'Carpenters',
}

const playing = ref(false)

function toggle() {
  playing.value = !playing.value
}
</script>

<template>
  <div class="music card">
    <span class="music__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </span>

    <div class="music__info">
      <p class="music__title">{{ track.title }}</p>
      <p class="music__artist">{{ track.artist }}</p>
    </div>

    <button
      type="button"
      class="music__play"
      :class="{ 'music__play--playing': playing }"
      :aria-label="playing ? '暂停' : '播放'"
      @click="toggle"
    >
      <svg v-if="!playing" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.music {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
}

.music__icon {
  width: 2.1rem;
  height: 2.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--home-accent-light);
  color: var(--home-accent-dark);
  flex-shrink: 0;
}

.music__icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.music__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.music__title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  word-break: break-word;
}

.music__artist {
  font-size: 0.68rem;
  color: #9ca3af;
  line-height: 1.3;
  word-break: break-word;
}

.music__play {
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgb(249 115 22 / 35%);
  transition: transform 0.15s, box-shadow 0.15s;
}

.music__play:hover {
  transform: scale(1.05);
}

.music__play--playing {
  background: linear-gradient(135deg, var(--home-accent), var(--home-accent-dark));
  box-shadow: 0 4px 12px rgb(20 184 166 / 45%);
}

.music__play svg {
  width: 1.05rem;
  height: 1.05rem;
}
</style>
