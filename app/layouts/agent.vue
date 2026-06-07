<template>
  <div class="agent-layout">
    <slot />
  </div>
</template>

<style>
.agent-layout {
  --home-accent: #14b8a6;
  --home-accent-dark: #0d9488;
  --home-accent-light: #ccfbf1;
  --home-accent-pale: #f0fdfa;
  --home-shadow: rgb(20 184 166 / 12%);

  min-height: 100vh;
  background: #f7f8fa;
  color: #1a1a1a;
}
</style>
