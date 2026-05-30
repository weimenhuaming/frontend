<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '创作管理 · Chenaqi Blog' })

const auth = useAuth()

onMounted(() => auth.hydrate())
</script>

<template>
  <div v-if="auth.isAdmin.value" class="subpage subpage--admin">
    <article class="subpage__article card">
      <h1 class="subpage__title">创作管理</h1>
      <p class="subpage__lead">
        博客管理入口，管理员可在此发布、编辑与删除文章（功能后续补充）。
      </p>
    </article>
  </div>

  <div v-else class="admin-denied">
    <div class="admin-denied__panel card">
      <p class="admin-denied__icon" aria-hidden="true">🔒</p>
      <h1 class="admin-denied__title">暂无访问权限</h1>
      <p class="admin-denied__text">
        抱歉，「创作管理」目前仅对管理员账号开放，普通用户与访客暂时无法使用该功能。
      </p>
      <p class="admin-denied__text admin-denied__text--muted">
        若因此给您带来不便，敬请谅解。
      </p>
    </div>
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

.subpage--admin {
  max-width: 42rem;
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
  margin: 0;
  color: #6b7280;
}

.admin-denied {
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

.admin-denied__text--muted {
  margin-top: 0.75rem;
  font-size: 0.9375rem;
  color: #6b7280;
}
</style>
