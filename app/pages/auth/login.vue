<script setup lang="ts">
import { emailLogin, sendVerificationCode } from '~/api/auth'
import { useAuthStore } from '~/stores/auth'
import { isSixDigitCode, isValidQqEmail } from '~/utils/validation'

definePageMeta({ layout: 'home' })

useSeoMeta({ title: '登录' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const captcha = ref('')
const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)
const error = ref('')
const sentHint = ref('')

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  authStore.hydrate()
  if (authStore.isLoggedIn) {
    navigateTo(String(route.query.redirect || '/'))
  }
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})

function startCountdown(seconds = 60) {
  countdown.value = seconds
  if (timer)
    clearInterval(timer)
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

async function onSendCode() {
  error.value = ''
  sentHint.value = ''

  const emailValue = email.value.trim()
  if (!isValidQqEmail(emailValue)) {
    error.value = '请输入用于接收验证码的 QQ 邮箱（@qq.com）'
    return
  }

  sending.value = true
  try {
    await sendVerificationCode(emailValue)
    sentHint.value = `验证码已发送至 ${emailValue}，请查收 QQ 邮箱（含垃圾箱）`
    startCountdown()
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '验证码发送失败'
  }
  finally {
    sending.value = false
  }
}

async function onSubmit() {
  error.value = ''

  const emailValue = email.value.trim()
  const codeValue = captcha.value.trim()

  if (!isValidQqEmail(emailValue)) {
    error.value = '请输入用于接收验证码的 QQ 邮箱（@qq.com）'
    return
  }
  if (!isSixDigitCode(codeValue)) {
    error.value = '请填写邮箱收到的 6 位数字验证码'
    return
  }

  loading.value = true
  try {
    const data = await emailLogin({ email: emailValue, captcha: codeValue })
    authStore.setSession(data)
    await router.push(String(route.query.redirect || '/'))
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '登录失败，请重试'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="subpage subpage--signin">
    <div class="signin card">
      <section class="signin__panel signin__panel--intro">
        <p class="signin__badge">邮箱验证码登录</p>
        <h1 class="signin__title">欢迎回来</h1>
        <p class="signin__desc">
          使用 QQ 邮箱接收一次性验证码，无需密码，安全快捷。
        </p>
        <ul class="signin__steps">
          <li>填写 QQ 邮箱地址</li>
          <li>点击发送验证码</li>
          <li>输入邮件中的 6 位码并登录</li>
        </ul>
      </section>

      <section class="signin__panel signin__panel--form">
        <form class="signin__form" @submit.prevent="onSubmit">
          <h2 class="signin__form-title">账号登录</h2>

          <p v-if="error" class="signin__alert signin__alert--error">
            {{ error }}
          </p>
          <p v-else-if="sentHint" class="signin__alert signin__alert--success">
            {{ sentHint }}
          </p>

          <label class="signin__field">
            <span class="signin__label">QQ 邮箱</span>
            <input
              v-model="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="123456@qq.com"
              required
            >
          </label>

          <label class="signin__field">
            <span class="signin__label">验证码</span>
            <div class="signin__code-row">
              <input
                v-model="captcha"
                type="text"
                inputmode="numeric"
                maxlength="6"
                autocomplete="one-time-code"
                placeholder="6 位数字"
                required
              >
              <button
                type="button"
                class="signin__send"
                :disabled="sending || countdown > 0"
                @click="onSendCode"
              >
                {{ countdown > 0 ? `${countdown}s 后重发` : (sending ? '发送中…' : '发送验证码') }}
              </button>
            </div>
          </label>

          <button type="submit" class="signin__submit" :disabled="loading">
            {{ loading ? '登录中…' : '登录' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.subpage--signin {
  max-width: 52rem;
  margin: 0 auto;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.signin {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
}

.signin__panel {
  padding: 2.5rem 2rem;
}

.signin__panel--intro {
  background: linear-gradient(145deg, #0d9488 0%, #14b8a6 55%, #2dd4bf 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signin__badge {
  display: inline-block;
  width: fit-content;
  padding: 0.25rem 0.75rem;
  margin-bottom: 1rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 18%);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.signin__title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.signin__desc {
  font-size: 0.9375rem;
  line-height: 1.7;
  opacity: 0.92;
  margin-bottom: 1.75rem;
}

.signin__steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: 0.875rem;
}

.signin__steps li {
  position: relative;
  padding-left: 1.25rem;
}

.signin__steps li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--home-accent-light);
}

.signin__panel--form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.signin__form {
  width: 100%;
  max-width: 360px;
}

.signin__form-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #1a1a1a;
}

.signin__alert {
  margin-bottom: 1rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.signin__alert--error {
  background: #fef2f2;
  color: #b91c1c;
}

.signin__alert--success {
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
}

.signin__field {
  display: block;
  margin-bottom: 1rem;
}

.signin__label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.signin__field input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 10px;
  background: rgb(255 255 255 / 55%);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.signin__field input:focus {
  border-color: var(--home-accent);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 18%);
}

.signin__code-row {
  display: flex;
  gap: 0.5rem;
}

.signin__code-row input {
  flex: 1;
  min-width: 0;
}

.signin__send {
  flex-shrink: 0;
  padding: 0 0.9rem;
  border: 1px solid var(--home-accent-soft);
  border-radius: 10px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, opacity 0.15s;
}

.signin__send:hover:not(:disabled) {
  background: var(--home-accent-light);
}

.signin__send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.signin__submit {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  background: var(--home-accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.signin__submit:hover:not(:disabled) {
  background: var(--home-accent-dark);
}

.signin__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .signin {
    grid-template-columns: 1fr;
  }

  .signin__panel--intro {
    padding: 1.75rem 1.5rem;
  }

  .signin__title {
    font-size: 1.5rem;
  }
}
</style>
