<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const displayName = computed(() => auth.user.value?.name || '访客')
const avatarUrl = computed(() => {
  const avatar = auth.user.value?.avatar?.trim()
  if (avatar)
    return avatar
  const name = encodeURIComponent(displayName.value.slice(0, 1) || 'U')
  return `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff&size=80`
})

const menuItems = computed(() => {
  const items = [
    { label: '个人中心', to: '/user', icon: '◉' },
  ]
  if (auth.isAdmin.value) {
    items.push({ label: '管理后台', to: '/admin', icon: '⚙' })
  }
  return items
})

function showMenu() {
  open.value = true
}

function hideMenu() {
  open.value = false
}

async function onLogout() {
  hideMenu()
  await auth.logout()
  await router.push('/')
}

function onClickOutside(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node))
    hideMenu()
}

onMounted(() => {
  auth.hydrate()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="root" class="nav-user">
    <NuxtLink
      v-if="!auth.isLoggedIn.value"
      to="/auth/login"
      class="nav-user__login"
    >
      登录
    </NuxtLink>

    <div
      v-else
      class="nav-user__profile"
      @mouseenter="showMenu"
      @mouseleave="hideMenu"
      @focusin="showMenu"
      @focusout="hideMenu"
    >
      <button
        type="button"
        class="nav-user__trigger"
        aria-haspopup="true"
        :aria-expanded="open"
      >
        <img
          :src="avatarUrl"
          :alt="displayName"
          class="nav-user__avatar"
          width="36"
          height="36"
        >
      </button>

      <Transition name="nav-user-menu">
        <div v-show="open" class="nav-user__menu" role="menu">
          <div class="nav-user__menu-head">
            <img
              :src="avatarUrl"
              :alt="displayName"
              class="nav-user__menu-avatar"
              width="40"
              height="40"
            >
            <div class="nav-user__menu-meta">
              <span class="nav-user__menu-name">{{ displayName }}</span>
              <span class="nav-user__menu-role">{{ auth.user.value?.role }}</span>
            </div>
          </div>

          <div class="nav-user__menu-divider" />

          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="nav-user__menu-item"
            role="menuitem"
            @click="hideMenu"
          >
            <span class="nav-user__menu-icon" aria-hidden="true">{{ item.icon }}</span>
            {{ item.label }}
          </NuxtLink>

          <button
            type="button"
            class="nav-user__menu-item nav-user__menu-item--danger"
            role="menuitem"
            @click="onLogout"
          >
            <span class="nav-user__menu-icon" aria-hidden="true">↪</span>
            退出登录
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.nav-user {
  margin-left: auto;
  position: relative;
  flex-shrink: 0;
}

.nav-user__login {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  background: #eff6ff;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.nav-user__login:hover {
  background: #dbeafe;
  color: var(--color-accent-hover);
}

.nav-user__profile {
  position: relative;
}

.nav-user__profile::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 0.6rem;
}

.nav-user__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 999px;
  background: none;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.nav-user__trigger:hover,
.nav-user__trigger:focus-visible {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 15%);
  outline: none;
}

.nav-user__avatar {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

.nav-user__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  padding: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgb(15 23 42 / 12%);
  z-index: 200;
}

.nav-user__menu-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.65rem;
}

.nav-user__menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
}

.nav-user__menu-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nav-user__menu-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-user__menu-role {
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: lowercase;
}

.nav-user__menu-divider {
  height: 1px;
  margin: 0.35rem 0;
  background: var(--color-border);
}

.nav-user__menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.65rem;
  border: none;
  border-radius: 8px;
  background: none;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s;
}

.nav-user__menu-item:hover {
  background: #f3f4f6;
}

.nav-user__menu-item--danger {
  color: #dc2626;
}

.nav-user__menu-item--danger:hover {
  background: #fef2f2;
}

.nav-user__menu-icon {
  width: 1rem;
  text-align: center;
  opacity: 0.7;
  font-size: 0.8rem;
}

.nav-user-menu-enter-active,
.nav-user-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.nav-user-menu-enter-from,
.nav-user-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
