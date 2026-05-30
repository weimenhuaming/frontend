<template>
  <div class="decor decor--city card">
    <div
      class="decor__city-bg"
      :style="{ backgroundImage: 'url(/images/beijing.jpg)' }"
      aria-hidden="true"
    />
    <div class="decor__city-content">
      <span class="decor__city-pin" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5z" />
        </svg>
      </span>
      <div class="decor__city-text">
        <span class="decor__city-name">Beijing</span>
        <span class="decor__city-motto">Code · Create · Share</span>
      </div>
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

.decor--city {
  position: relative;
  overflow: hidden;
  min-height: 3.5rem;
}

.decor__city-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.35;
  filter: saturate(1.1);
}

.decor__city-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(90deg, rgb(255 255 255 / 82%) 0%, rgb(255 255 255 / 55%) 100%);
}

.decor__city-pin {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--home-accent);
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgb(20 184 166 / 40%);
}

.decor__city-pin svg {
  width: 0.95rem;
  height: 0.95rem;
}

.decor__city-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.decor__city-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1a1a;
}

.decor__city-motto {
  font-size: 0.68rem;
  color: #6b7280;
  letter-spacing: 0.04em;
}
</style>
