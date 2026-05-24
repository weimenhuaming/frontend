<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: '首页', to: '/' },
  { label: '博客', to: '/blog' },
  { label: '关于', to: '/about' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__logo">
        <span class="header__logo-icon">✦</span>
        Chenaqi Blog
      </NuxtLink>

      <nav class="header__nav" aria-label="主导航">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="header__link"
          :class="{ 'header__link--active': isActive(item.to) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <NavUserArea />
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgb(0 0 0 / 4%);
}

.header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text);
  text-decoration: none;
  flex-shrink: 0;
}

.header__logo:hover {
  color: var(--color-accent);
}

.header__logo-icon {
  color: var(--color-accent);
  font-size: 1.25rem;
}

.header__nav {
  display: flex;
  gap: 0.15rem;
  flex: 1;
}

.header__link {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  color: var(--color-muted);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.header__link:hover {
  color: var(--color-text);
  background: #f3f4f6;
}

.header__link--active {
  color: var(--color-accent);
  background: #eff6ff;
}
</style>
