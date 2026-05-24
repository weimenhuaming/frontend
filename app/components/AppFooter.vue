<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
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
</style>
