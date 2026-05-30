<script setup lang="ts">
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const hours = computed(() => now.value.getHours().toString().padStart(2, '0'))
const minutes = computed(() => now.value.getMinutes().toString().padStart(2, '0'))

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <div class="clock card">
    <div class="clock__screen">
      <span class="clock__digits">{{ hours }}</span>
      <span class="clock__sep">:</span>
      <span class="clock__digits">{{ minutes }}</span>
    </div>
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

.clock {
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock__screen {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.55rem 1.1rem;
  border-radius: 14px;
  background: linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow:
    inset 0 2px 5px rgb(0 0 0 / 12%),
    inset 0 -1px 3px rgb(255 255 255 / 80%);
}

.clock__digits,
.clock__sep {
  font-family: 'Digital-7', 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 0 rgb(255 255 255 / 60%);
}

.clock__sep {
  font-size: 2.2rem;
  margin: 0 -0.1rem;
  animation: blink 1.4s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0.35;
  }
}
</style>
