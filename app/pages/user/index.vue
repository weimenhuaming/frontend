<script setup lang="ts">
definePageMeta({
  layout: 'home',
  middleware: 'auth',
})

useSeoMeta({ title: '个人中心 · Chenaqi Blog' })

const auth = useAuth()
const router = useRouter()
const loggingOut = ref(false)

async function onLogout() {
  loggingOut.value = true
  try {
    await auth.logout()
    await router.push('/')
  }
  finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div class="subpage subpage--article">
    <article class="subpage__article card">
      <h1 class="subpage__title">个人中心</h1>
      <p class="subpage__lead">功能开发中，敬请期待。</p>

      <div v-if="auth.user" class="subpage__profile">
        <dl class="subpage__dl">
          <dt>用户名</dt>
          <dd>{{ auth.user.name }}</dd>
          <dt>邮箱</dt>
          <dd>{{ auth.user.email }}</dd>
          <dt>角色</dt>
          <dd>{{ auth.user.role }}</dd>
        </dl>
      </div>

      <button
        type="button"
        class="subpage__logout"
        :disabled="loggingOut"
        @click="onLogout"
      >
        {{ loggingOut ? '退出中…' : '退出登录' }}
      </button>
    </article>
  </div>
</template>

<style scoped>
.subpage--article {
  max-width: 42rem;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.subpage__article {
  padding: 2rem 2.25rem;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #374151;
}

.subpage__title {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
}

.subpage__lead {
  margin: 0 0 1.5rem;
  color: #6b7280;
}

.subpage__profile {
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: rgb(255 255 255 / 55%);
  border: 1px solid rgb(255 255 255 / 80%);
}

.subpage__dl {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem 1rem;
  font-size: 0.9375rem;
}

.subpage__dl dt {
  color: #9ca3af;
  font-weight: 500;
}

.subpage__dl dd {
  margin: 0;
  font-weight: 600;
  color: #1a1a1a;
}

.subpage__logout {
  margin-top: 1.5rem;
  padding: 0.65rem 1.25rem;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}

.subpage__logout:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
}

.subpage__logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
