<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

const navItems = [
  { label: '站内助手', to: '/agent', icon: 'ai' },
  { label: '个人中心', to: '/user', icon: 'user' },
  { label: '创作管理', to: '/admin', icon: 'admin' },
  { label: '文章专栏', to: '/blog', icon: 'article' },
  { label: '关于网站', to: '/about', icon: 'about' },
]

const isHome = computed(() => route.path === '/')
const isCompact = computed(() => !isHome.value)

const displayName = computed(() => auth.user.value?.name || '')

const DEFAULT_AVATAR = '/images/moren.png'

const activeIndex = computed(() => {
  const index = navItems.findIndex(item => route.path.startsWith(item.to))
  return index >= 0 ? index : 0
})

const profileLink = computed(() => {
  if (isCompact.value)
    return '/'
  return auth.isLoggedIn.value ? '/user' : '/auth/login'
})

const hoveredIndex = ref(activeIndex.value)

watch(activeIndex, (index) => {
  hoveredIndex.value = index
})

watch(() => route.path, () => {
  navHidden.value = false
  lastScrollY = window.scrollY
})

function isActive(path: string) {
  return route.path.startsWith(path)
}

const navHidden = ref(false)
let lastScrollY = 0

function onScroll() {
  if (!isCompact.value)
    return

  const currentScrollY = window.scrollY

  if (currentScrollY <= 64) {
    navHidden.value = false
  }
  else if (currentScrollY > lastScrollY + 8) {
    navHidden.value = true
  }
  else if (currentScrollY < lastScrollY - 8) {
    navHidden.value = false
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  auth.hydrate()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <aside
    class="home-nav"
    :class="{
      'home-nav--compact': isCompact,
      'home-nav--full': !isCompact,
      'home-nav--hidden': isCompact && navHidden,
    }"
    aria-label="站点导航"
  >
    <div class="home-nav__panel card">
      <NuxtLink
        :to="profileLink"
        class="home-nav__profile"
        :class="{ 'home-nav__profile--compact': isCompact }"
      >
        <img
          :src="DEFAULT_AVATAR"
          :alt="auth.isLoggedIn.value ? displayName : '登入'"
          class="home-nav__avatar"
          width="44"
          height="44"
        >
        <template v-if="!isCompact">
          <div v-if="!auth.isLoggedIn.value" class="home-nav__profile-text">
            <p class="home-nav__name">
              登入
              <span class="home-nav__badge">(未登录)</span>
            </p>
            <p class="home-nav__tag">点击登录账号</p>
          </div>
          <div v-else class="home-nav__profile-text">
            <p class="home-nav__name">
              {{ displayName }}
              <span class="home-nav__badge">(开发中)</span>
            </p>
            <p class="home-nav__tag">{{ auth.user.value?.role || 'user' }}</p>
          </div>
        </template>
      </NuxtLink>

      <div class="home-nav__menu">
        <p v-if="!isCompact" class="home-nav__menu-title">
          GENERAL
        </p>

        <div
          class="home-nav__links"
          :class="{ 'home-nav__links--compact': isCompact }"
        >
          <span
            class="home-nav__indicator"
            :class="{ 'home-nav__indicator--compact': isCompact }"
            :style="isCompact
              ? {
                transform: `translate(calc(var(--nav-step) * ${hoveredIndex}), -50%)`,
              }
              : {
                transform: `translateY(calc(${hoveredIndex} * (2.45rem + 0.1rem)))`,
                width: '100%',
                height: '2.45rem',
              }"
          />

          <NuxtLink
            v-for="(item, index) in navItems"
            :key="item.to"
            :to="item.to"
            class="home-nav__link"
            :class="{
              'home-nav__link--active': isActive(item.to),
              'home-nav__link--compact': isCompact,
            }"
            @mouseenter="hoveredIndex = index"
          >
            <span class="home-nav__icon" aria-hidden="true">
              <svg v-if="item.icon === 'ai'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 6V4" />
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
                <path d="M9 16h6" />
              </svg>
              <svg v-else-if="item.icon === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
              </svg>
              <svg v-else-if="item.icon === 'article'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M8 7h8M8 11h8M8 15h5" />
              </svg>
              <svg v-else-if="item.icon === 'about'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <svg v-else-if="item.icon === 'share'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                <path d="M12 16V4M8 8l4-4 4 4" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
            </span>
            <span v-if="!isCompact" class="home-nav__label">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.home-nav {
  align-self: start;
  transition:
    top 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    left 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-nav--compact {
  position: fixed;
  top: 1rem;
  left: 1.5rem;
  z-index: 100;
  width: auto;
}

.home-nav--compact.home-nav--hidden {
  transform: translateY(calc(-100% - 1.5rem));
  opacity: 0;
  pointer-events: none;
}

.home-nav__panel {
  overflow: hidden;
  transition:
    border-radius 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.home-nav--full {
  position: sticky;
  top: 1.75rem;
  align-self: center;
}

.home-nav--full .home-nav__panel {
  padding: 0.75rem 0.9rem 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-nav--full .home-nav__menu {
  margin-top: 0.75rem;
}

.home-nav--compact .home-nav__panel {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.65rem 0.85rem;
  border-radius: 999px;
}

.home-nav__profile {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s;
}

.home-nav__profile--compact {
  flex-shrink: 0;
}

.home-nav__profile:hover {
  transform: translateY(-1px);
}

.home-nav__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgb(20 184 166 / 22%);
}

.home-nav__profile-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.home-nav__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.home-nav__badge {
  font-size: 0.65rem;
  font-weight: 500;
  color: #9ca3af;
}

.home-nav__tag {
  font-size: 0.7rem;
  color: #9ca3af;
}

.home-nav__menu {
  margin-top: 0.85rem;
}

.home-nav--compact .home-nav__menu {
  margin-top: 0;
}

.home-nav__menu-title {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #9ca3af;
  padding: 0 0.65rem 0.6rem;
}

.home-nav__links {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.home-nav__links--compact {
  --nav-link-size: 2rem;
  --nav-link-gap: 1.25rem;
  --nav-step: calc(var(--nav-link-size) + var(--nav-link-gap));
  flex-direction: row;
  align-items: center;
  gap: var(--nav-link-gap);
}

.home-nav__indicator {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 999px;
  background: linear-gradient(to right bottom, rgb(255 255 255 / 95%) 60%, var(--home-accent-light) 100%);
  border: 1px solid rgb(255 255 255 / 90%);
  box-shadow: 0 4px 14px var(--home-shadow);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: 0;
}

.home-nav__indicator--compact {
  top: 50%;
  width: var(--nav-link-size);
  height: var(--nav-link-size);
}

.home-nav__link {
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

.home-nav__link--compact {
  width: var(--nav-link-size, 2rem);
  height: var(--nav-link-size, 2rem);
  padding: 0;
  justify-content: center;
  border-radius: 999px;
}

.home-nav__link:hover,
.home-nav__link--active {
  color: var(--home-accent-dark);
}

.home-nav__link--active {
  font-weight: 600;
}

.home-nav__icon {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.home-nav__link--compact .home-nav__icon {
  width: 1.15rem;
  height: 1.15rem;
}

.home-nav__icon svg {
  width: 100%;
  height: 100%;
}

.home-nav__label {
  white-space: nowrap;
}

@media (max-width: 960px) {
  .home-nav--compact {
    left: 50%;
    transform: translateX(-50%);
    width: min(calc(100% - 2rem), 24rem);
  }

  .home-nav--compact.home-nav--hidden {
    transform: translate(-50%, calc(-100% - 1.5rem));
  }

  .home-nav--compact .home-nav__panel {
    justify-content: center;
  }

  .home-nav__links--compact {
    --nav-link-gap: 0.85rem;
  }
}
</style>
