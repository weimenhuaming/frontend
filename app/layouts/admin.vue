<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

const navItems = [
  { label: '分类管理', to: '/admin' },
  { label: '文章列表', to: '/admin/articles' },
  { label: '新建文章', to: '/admin/article/create' },
]

function isActive(path: string) {
  if (path === '/admin')
    return route.path === '/admin'
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
          <template v-if="auth.isAdmin.value">
            <aside class="admin-shell__sidebar card">
              <div class="admin-shell__brand">
                <h2 class="admin-shell__brand-title">
                  创作管理
                </h2>
                <p class="admin-shell__brand-desc">
                  博客后台
                </p>
              </div>

              <nav class="admin-shell__nav" aria-label="管理菜单">
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
          </template>

          <div v-else class="admin-denied">
            <div class="admin-denied__panel card">
              <p class="admin-denied__icon" aria-hidden="true">
                🔒
              </p>
              <h1 class="admin-denied__title">
                暂无访问权限
              </h1>
              <p class="admin-denied__text">
                抱歉，「创作管理」目前仅对管理员账号开放。
              </p>
            </div>
          </div>
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

.admin-denied {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 14rem);
  padding: 2rem 0;
}

.admin-denied__panel {
  width: min(100%, 32rem);
  padding: 3rem 2.5rem;
  text-align: center;
}

.admin-denied__icon {
  margin: 0 0 1rem;
  font-size: 2.5rem;
  line-height: 1;
}

.admin-denied__title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.admin-denied__text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
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
