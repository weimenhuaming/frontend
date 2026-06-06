<script setup lang="ts">
import { getUserProfile, updateUserProfile } from '~/api/user'
import { uploadAvatar } from '~/api/upload'
import { resolveUserAvatar } from '~/utils/user'

definePageMeta({
  layout: 'admin',
  middleware: 'dashboard',
})

useSeoMeta({ title: '个人中心 · Chenaqi Blog' })

const auth = useAuth()
const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()
const { roleLabel } = useUserAvatar()

const loading = ref(true)
const saving = ref(false)
const uploadingAvatar = ref(false)
const loggingOut = ref(false)
const error = ref('')
const success = ref('')
const avatarInputRef = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  sex: '未知',
  age: 0,
  avatar: '',
})

const previewAvatarUrl = computed(() =>
  resolveUserAvatar(form.avatar || auth.user.value?.avatar, form.name, config.public.apiBase),
)

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    auth.hydrate()
    const profile = await getUserProfile()
    form.name = profile.name
    form.phone = profile.phone
    form.email = profile.email
    form.sex = profile.sex || '未知'
    form.age = profile.age || 0
    form.avatar = profile.avatar
    authStore.updateUser(profile)
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '加载资料失败'
  }
  finally {
    loading.value = false
  }
}

async function onSave() {
  error.value = ''
  success.value = ''
  saving.value = true
  try {
    const payload: Record<string, string | number> = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      sex: form.sex,
    }
    if (form.age > 0)
      payload.age = form.age
    if (auth.isAdmin.value && form.avatar.trim())
      payload.avatar = form.avatar.trim()

    const profile = await updateUserProfile(payload)
    authStore.updateUser(profile)
    success.value = '资料已保存'
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '保存失败'
  }
  finally {
    saving.value = false
  }
}

function onAvatarClick() {
  if (auth.isAdmin.value)
    avatarInputRef.value?.click()
}

async function onAvatarChange(event: Event) {
  if (!auth.isAdmin.value)
    return

  error.value = ''
  success.value = ''

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file)
    return

  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    input.value = ''
    return
  }

  uploadingAvatar.value = true
  try {
    const url = await uploadAvatar(file)
    form.avatar = url
    const profile = await updateUserProfile({ avatar: url })
    authStore.updateUser(profile)
    success.value = '头像已更新'
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '头像上传失败'
  }
  finally {
    uploadingAvatar.value = false
    input.value = ''
  }
}

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

onMounted(loadProfile)
</script>

<template>
  <div class="admin-view admin-view--profile">
    <section v-if="loading" class="admin-panel card">
      <p class="admin-panel__empty">加载中…</p>
    </section>

    <div v-else class="profile-layout">
      <!-- 左侧：大头像 + 基本信息 -->
      <aside class="profile-sidebar card">
        <button
          type="button"
          class="profile-sidebar__avatar-btn"
          :class="{ 'profile-sidebar__avatar-btn--editable': auth.isAdmin.value }"
          :disabled="uploadingAvatar"
          @click="onAvatarClick"
        >
          <UserAvatar
            :src="previewAvatarUrl"
            :name="form.name"
            :size="240"
            class="profile-sidebar__avatar"
          />
          <span v-if="auth.isAdmin.value" class="profile-sidebar__avatar-hint">
            {{ uploadingAvatar ? '上传中…' : '更换头像' }}
          </span>
        </button>
        <input
          ref="avatarInputRef"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          class="profile-sidebar__file-input"
          @change="onAvatarChange"
        >

        <h1 class="profile-sidebar__name">
          {{ form.name || '未设置昵称' }}
        </h1>
        <p class="profile-sidebar__handle">
          {{ form.email || '—' }}
        </p>
        <p class="profile-sidebar__role">
          {{ roleLabel }}
        </p>

        <p v-if="!auth.isAdmin.value" class="profile-sidebar__hint">
          头像由管理员维护
        </p>
      </aside>

      <!-- 右侧：资料编辑 -->
      <section class="profile-main card">
        <header class="profile-main__header">
          <h2 class="profile-main__title">编辑资料</h2>
          <p class="profile-main__desc">修改你的个人信息</p>
        </header>

        <form class="profile-main__form" @submit.prevent="onSave">
          <div class="profile-main__grid">
            <label class="profile-main__field">
              <span>昵称</span>
              <input v-model="form.name" type="text" maxlength="32" required>
            </label>

            <label class="profile-main__field">
              <span>邮箱</span>
              <input v-model="form.email" type="email" disabled>
            </label>

            <label class="profile-main__field">
              <span>手机</span>
              <input v-model="form.phone" type="tel" maxlength="20">
            </label>

            <label class="profile-main__field">
              <span>性别</span>
              <select v-model="form.sex">
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="未知">未知</option>
              </select>
            </label>

            <label class="profile-main__field">
              <span>年龄</span>
              <input v-model.number="form.age" type="number" min="0" max="150">
            </label>
          </div>

          <p v-if="error" class="admin-panel__error">{{ error }}</p>
          <p v-else-if="success" class="profile-main__success">{{ success }}</p>

          <div class="profile-main__actions">
            <button type="submit" class="admin-panel__btn admin-panel__btn--primary" :disabled="saving">
              {{ saving ? '保存中…' : '保存资料' }}
            </button>
            <button
              type="button"
              class="admin-panel__btn admin-panel__btn--danger"
              :disabled="loggingOut"
              @click="onLogout"
            >
              {{ loggingOut ? '退出中…' : '退出登录' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow, rgb(0 0 0 / 6%));
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

/* ── 左侧头像栏 ── */
.profile-sidebar {
  padding: 1.5rem 1.25rem 1.75rem;
  text-align: center;
}

.profile-sidebar__avatar-btn {
  position: relative;
  display: block;
  width: fit-content;
  margin: 0 auto 1.25rem;
  padding: 0;
  border: none;
  background: none;
  border-radius: 50%;
}

.profile-sidebar__avatar-btn--editable {
  cursor: pointer;
}

.profile-sidebar__avatar-btn--editable:hover .profile-sidebar__avatar-hint {
  opacity: 1;
}

.profile-sidebar__avatar :deep(.user-avatar) {
  border: none;
  box-shadow: 0 4px 20px rgb(20 184 166 / 18%);
}

.profile-sidebar__avatar-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgb(0 0 0 / 45%);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s;
}

.profile-sidebar__file-input {
  display: none;
}

.profile-sidebar__name {
  margin: 0 0 0.35rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.25;
  word-break: break-word;
}

.profile-sidebar__handle {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #57606a;
  word-break: break-all;
}

.profile-sidebar__role {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.profile-sidebar__hint {
  margin: 1rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid rgb(0 0 0 / 6%);
  font-size: 0.8125rem;
  color: #9ca3af;
}

/* ── 右侧资料区 ── */
.profile-main {
  padding: 1.5rem 1.75rem;
}

.profile-main__header {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgb(0 0 0 / 6%);
}

.profile-main__title {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
}

.profile-main__desc {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.profile-main__form {
  display: grid;
  gap: 1.25rem;
}

.profile-main__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.profile-main__field {
  display: grid;
  gap: 0.35rem;
}

.profile-main__field span {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.profile-main__field input,
.profile-main__field select {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 10px;
  background: rgb(255 255 255 / 80%);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.profile-main__field input:focus,
.profile-main__field select:focus {
  border-color: var(--home-accent, #14b8a6);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 15%);
}

.profile-main__field input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.profile-main__success {
  margin: 0;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: var(--home-accent-pale, #f0fdfa);
  color: var(--home-accent-dark, #0d9488);
  font-size: 0.8125rem;
}

.profile-main__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

@media (max-width: 860px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-main__grid {
    grid-template-columns: 1fr;
  }
}
</style>
