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
      <p class="footer__copy">
        © {{ year }}
        <a href="https://chena7.cn" class="footer__link" target="_blank" rel="noopener noreferrer">chena7.cn</a>
      </p>
      <p class="footer__icp">
        <a
          href="https://beian.miit.gov.cn/"
          class="footer__link"
          target="_blank"
          rel="noopener noreferrer"
        >浙ICP备2025156531号-1</a>
      </p>
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

.footer__copy,
.footer__icp {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.footer__icp {
  margin-top: 0.35rem;
}

.footer__link {
  color: inherit;
  text-decoration: none;
}

.footer__link:hover {
  text-decoration: underline;
}

.footer--home {
  border-top: 1px solid rgb(255 255 255 / 60%);
  background: rgb(255 255 255 / 35%);
  backdrop-filter: blur(12px);
}

.footer--home .footer__copy,
.footer--home .footer__icp {
  color: #6b7280;
}
</style>
