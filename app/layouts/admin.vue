<script setup lang="ts">
type AdminNavIcon = 'user' | 'like' | 'category' | 'list' | 'edit' | 'articles' | 'knowledge'

const route = useRoute()
const auth = useAuth()

const commonNavItems = [
  { label: '个人中心', to: '/admin/profile', icon: 'user' as AdminNavIcon },
  { label: '点赞列表', to: '/admin/likes', icon: 'like' as AdminNavIcon },
]

const adminNavItems = [
  { label: '分类管理', to: '/admin/categories', icon: 'category' as AdminNavIcon },
  { label: '博客列表', to: '/admin/articles', icon: 'list' as AdminNavIcon },
  { label: '新建文章', to: '/admin/article/create', icon: 'edit' as AdminNavIcon },
  { label: '我的博客', to: '/admin/my-articles', icon: 'articles' as AdminNavIcon },
  { label: '知识库管理', to: '/admin/knowledge', icon: 'knowledge' as AdminNavIcon },
]

const navItems = computed(() =>
  auth.isAdmin.value
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems,
)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const activeIndex = computed(() => {
  const index = navItems.value.findIndex(item => isActive(item.to))
  return index >= 0 ? index : 0
})

const hoveredIndex = ref(activeIndex.value)

watch(activeIndex, (index) => {
  hoveredIndex.value = index
})

onMounted(() => auth.hydrate())
</script>

<template>
  <div class="home-layout home-layout--subpage admin-shell-wrap">
    <div class="home-layout__body">
      <div class="home-shell">
        <div class="home-shell__sidebar-wrap">
          <HomeSidebar />
        </div>

        <main class="home-shell__main admin-shell">
          <aside class="admin-shell__sidebar card">
            <div class="admin-shell__brand">
              <h2 class="admin-shell__brand-title">
                后台管理
              </h2>
              <p class="admin-shell__brand-desc">
                个人中心与内容管理
              </p>
            </div>

            <nav class="admin-shell__nav" aria-label="后台菜单">
              <div class="admin-shell__links">
                <span
                  class="admin-shell__indicator"
                  :style="{
                    transform: `translateY(calc(${hoveredIndex} * (2.45rem + 0.1rem)))`,
                    width: '100%',
                    height: '2.45rem',
                  }"
                />

                <NuxtLink
                  v-for="(item, index) in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="admin-shell__nav-link"
                  :class="{ 'admin-shell__nav-link--active': isActive(item.to) }"
                  @mouseenter="hoveredIndex = index"
                >
                  <span class="admin-shell__icon" aria-hidden="true">
                    <svg v-if="item.icon === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
                    </svg>
                    <svg v-else-if="item.icon === 'like'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <svg v-else-if="item.icon === 'category'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 7h7l2 3h7v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" stroke-linejoin="round" />
                      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke-linecap="round" />
                    </svg>
                    <svg v-else-if="item.icon === 'list'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
                    </svg>
                    <svg v-else-if="item.icon === 'edit'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9" stroke-linecap="round" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg v-else-if="item.icon === 'articles'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      <path d="M8 7h8M8 11h8M8 15h5" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
                    </svg>
                  </span>
                  <span class="admin-shell__label">{{ item.label }}</span>
                </NuxtLink>
              </div>
            </nav>

            <NuxtLink to="/blog" class="admin-shell__back">
              ← 返回博客
            </NuxtLink>
          </aside>

          <section class="admin-shell__content">
            <slot />
          </section>
        </main>
      </div>
    </div>
    <AppFooter theme="home" />
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

.admin-shell-wrap {
  --home-accent: #14b8a6;
  --home-accent-dark: #0d9488;
  --home-accent-light: #ccfbf1;
  --home-accent-pale: #f0fdfa;
  --home-shadow: rgb(20 184 166 / 12%);
}

.admin-shell {
  display: grid;
  grid-template-columns: 13.5rem minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  width: 100%;
  max-width: 68rem;
  margin: 0 auto;
}

.admin-shell__sidebar {
  position: sticky;
  top: 6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1rem;
}

.admin-shell__brand-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1a;
}

.admin-shell__brand-desc {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}

.admin-shell__nav {
  margin-top: 0.15rem;
}

.admin-shell__links {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.admin-shell__indicator {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 999px;
  background: linear-gradient(to right bottom, rgb(255 255 255 / 95%) 60%, var(--home-accent-light, #ccfbf1) 100%);
  border: 1px solid rgb(255 255 255 / 90%);
  box-shadow: 0 4px 14px var(--home-shadow);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: 0;
}

.admin-shell__nav-link {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.7rem;
  border-radius: 12px;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s;
}

.admin-shell__nav-link:hover,
.admin-shell__nav-link--active {
  color: var(--home-accent-dark);
}

.admin-shell__nav-link--active {
  font-weight: 600;
}

.admin-shell__icon {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.admin-shell__icon svg {
  width: 100%;
  height: 100%;
}

.admin-shell__label {
  white-space: nowrap;
}

.admin-shell__back {
  margin-top: auto;
  padding: 0.55rem 0.85rem;
  font-size: 0.8125rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}

.admin-shell__back:hover {
  color: var(--home-accent-dark);
}

.admin-shell__content {
  min-width: 0;
}

@media (max-width: 960px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }

  .admin-shell__sidebar {
    position: static;
  }

  .admin-shell__back {
    margin-top: 0;
  }
}
</style>

<style>
.home-layout {
  --home-accent: #14b8a6;
  --home-accent-dark: #0d9488;
  --home-accent-light: #ccfbf1;
  --home-accent-soft: #99f6e4;
  --home-accent-pale: #f0fdfa;
  --home-shadow: rgb(20 184 166 / 12%);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5 0%, #ccfbf1 30%, #e0f2fe 60%, #fefce8 100%);
  background-attachment: fixed;
}

.home-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-shell-wrap .home-shell {
  display: block;
  width: 100%;
  max-width: none;
  padding: 0;
}

.admin-shell-wrap .home-shell__sidebar-wrap {
  height: 0;
  overflow: visible;
}

.admin-shell-wrap .home-shell__main {
  padding: 5.5rem 1.5rem 3rem;
  max-width: none;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .admin-shell-wrap .home-shell__main {
    padding-top: 6.5rem;
  }
}
</style>
