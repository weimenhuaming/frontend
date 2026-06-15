<template>
  <div class="life-layout">
    <div class="life-layout__nav" aria-hidden="false">
      <HomeSidebar />
    </div>
    <slot />
  </div>
</template>

<style>
.life-layout {
  --life-sky: #9ed4ff;
  --life-peach: #ffd6e8;
  --life-cream: #fff8e7;
  --life-coral: #ff8fab;
  --life-lilac: #c4b5fd;
  --life-shadow: rgb(255 143 171 / 22%);

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, rgb(255 249 196 / 70%) 0%, transparent 42%),
    radial-gradient(circle at 88% 12%, rgb(255 214 232 / 65%) 0%, transparent 38%),
    radial-gradient(circle at 72% 88%, rgb(196 181 253 / 45%) 0%, transparent 40%),
    linear-gradient(165deg, #a8d8ff 0%, #ffe8f0 42%, #fff5e0 100%);
  background-attachment: fixed;
}

.life-layout__nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  pointer-events: none;
}

.life-layout__nav > * {
  pointer-events: auto;
}
</style>
