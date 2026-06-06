<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

const commonNavItems = [
  { label: '个人中心', to: '/admin/profile' },
  { label: '点赞列表', to: '/admin/likes' },
]

const adminNavItems = [
  { label: '分类管理', to: '/admin/categories' },
  { label: '博客列表', to: '/admin/articles' },
  { label: '新建文章', to: '/admin/article/create' },
  { label: '我的博客', to: '/admin/my-articles' },
]

const navItems = computed(() =>
  auth.isAdmin.value
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems,
)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

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
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="admin-shell__nav-link"
                :class="{ 'admin-shell__nav-link--active': isActive(item.to) }"
              >
                {{ item.label }}
              </NuxtLink>
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
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.admin-shell__nav-link {
  display: block;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.admin-shell__nav-link:hover {
  background: rgb(255 255 255 / 55%);
  color: var(--home-accent-dark);
}

.admin-shell__nav-link--active {
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-weight: 600;
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

  .admin-shell__nav {
    flex-direction: row;
    flex-wrap: wrap;
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
