<script setup lang="ts">
withDefaults(defineProps<{
  theme?: 'default' | 'home'
}>(), {
  theme: 'default',
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer" :class="{ 'footer--home': theme === 'home' }">
    <div class="footer__inner">
      <p class="footer__copy">© {{ year }} Chenaqi Blog</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 1.5rem;
}

.footer__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  text-align: center;
}

.footer__copy {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.footer--home {
  border-top: 1px solid rgb(255 255 255 / 60%);
  background: rgb(255 255 255 / 35%);
  backdrop-filter: blur(12px);
}

.footer--home .footer__copy {
  color: #6b7280;
}
</style>
