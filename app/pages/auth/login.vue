<script setup lang="ts">
import {
  emailLogin,
  getCaptcha,
  register,
  resetPassword,
  sendVerificationCode,
  usernameLogin,
} from '~/api/auth'
import { useAuthStore } from '~/stores/auth'
import { isSixDigitCode, isValidQqEmail } from '~/utils/validation'

definePageMeta({ layout: 'home' })

type LoginTab = 'email' | 'account'
type EmailSubMode = 'login' | 'register' | 'reset'

useSeoMeta({ title: '登录' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loginTab = ref<LoginTab>('email')
const emailSubMode = ref<EmailSubMode>('login')

const email = ref('')
const emailCaptcha = ref('')
const name = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const imageCaptchaId = ref('')
const imageCaptchaCode = ref('')
const captchaPic = ref('')

const loading = ref(false)
const sending = ref(false)
const countdown = ref(0)
const error = ref('')
const sentHint = ref('')
const success = ref('')

let timer: ReturnType<typeof setInterval> | null = null

const captchaImageSrc = computed(() => {
  const pic = captchaPic.value
  if (!pic)
    return ''
  return pic.startsWith('data:') ? pic : `data:image/png;base64,${pic}`
})

const formTitle = computed(() => {
  if (loginTab.value === 'account')
    return '账号登录'
  if (emailSubMode.value === 'register')
    return '注册账号'
  if (emailSubMode.value === 'reset')
    return '找回密码'
  return 'QQ 邮箱登录'
})

const submitLabel = computed(() => {
  if (loading.value) {
    if (loginTab.value === 'account')
      return '登录中…'
    if (emailSubMode.value === 'register')
      return '注册中…'
    if (emailSubMode.value === 'reset')
      return '提交中…'
    return '登录中…'
  }
  if (loginTab.value === 'account')
    return '登录'
  if (emailSubMode.value === 'register')
    return '注册'
  if (emailSubMode.value === 'reset')
    return '重置密码'
  return '登录'
})

onMounted(async () => {
  authStore.hydrate()
  if (authStore.isLoggedIn) {
    navigateTo(String(route.query.redirect || '/'))
    return
  }

  const queryMode = route.query.mode
  if (queryMode === 'register') {
    loginTab.value = 'email'
    emailSubMode.value = 'register'
  }
  else if (queryMode === 'reset') {
    loginTab.value = 'email'
    emailSubMode.value = 'reset'
  }

  if (loginTab.value === 'account')
    await refreshImageCaptcha()
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})

function clearMessages() {
  error.value = ''
  success.value = ''
  sentHint.value = ''
}

function switchLoginTab(tab: LoginTab) {
  loginTab.value = tab
  clearMessages()
  emailCaptcha.value = ''
  imageCaptchaCode.value = ''
  password.value = ''
  confirmPassword.value = ''
  if (tab === 'email')
    emailSubMode.value = 'login'
  else
    void refreshImageCaptcha()
}

function switchEmailSubMode(mode: EmailSubMode) {
  emailSubMode.value = mode
  clearMessages()
  emailCaptcha.value = ''
  password.value = ''
  confirmPassword.value = ''
  if (mode !== 'register')
    name.value = ''
}

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

function validateEmail() {
  const emailValue = email.value.trim()
  if (!isValidQqEmail(emailValue)) {
    error.value = '请输入用于接收验证码的 QQ 邮箱（@qq.com）'
    return null
  }
  return emailValue
}

function validateEmailCaptcha(codeValue = emailCaptcha.value.trim()) {
  if (!isSixDigitCode(codeValue)) {
    error.value = '请填写邮箱收到的 6 位数字验证码'
    return null
  }
  return codeValue
}

function validateImageCaptcha() {
  const code = imageCaptchaCode.value.trim()
  if (!isSixDigitCode(code)) {
    error.value = '请填写图片中的 6 位验证码'
    return null
  }
  if (!imageCaptchaId.value) {
    error.value = '验证码加载失败，请点击图片刷新'
    return null
  }
  return code
}

function validatePasswordPair(pwd: string, confirm: string) {
  if (pwd.length < 6) {
    error.value = '密码至少 6 位'
    return false
  }
  if (pwd !== confirm) {
    error.value = '两次输入的密码不一致'
    return false
  }
  return true
}

async function refreshImageCaptcha() {
  try {
    const data = await getCaptcha()
    imageCaptchaId.value = data.captcha_id
    captchaPic.value = data.pic_base64
    imageCaptchaCode.value = ''
  }
  catch {
    error.value = '验证码加载失败，请稍后重试'
  }
}

async function onSendCode() {
  clearMessages()

  const emailValue = validateEmail()
  if (!emailValue)
    return

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

async function onSubmitEmailLogin() {
  clearMessages()

  const emailValue = validateEmail()
  if (!emailValue)
    return
  const codeValue = validateEmailCaptcha()
  if (!codeValue)
    return

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

async function onSubmitAccountLogin() {
  clearMessages()

  const usernameValue = username.value.trim()
  if (!usernameValue) {
    error.value = '请填写用户名'
    return
  }
  if (!password.value) {
    error.value = '请填写密码'
    return
  }
  const codeValue = validateImageCaptcha()
  if (!codeValue)
    return

  loading.value = true
  try {
    const data = await usernameLogin({
      username: usernameValue,
      password: password.value,
      captcha_id: imageCaptchaId.value,
      verificationCode: codeValue,
    })
    authStore.setSession(data)
    await router.push(String(route.query.redirect || '/'))
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '登录失败，请重试'
    await refreshImageCaptcha()
  }
  finally {
    loading.value = false
  }
}

async function onSubmitRegister() {
  clearMessages()

  const emailValue = validateEmail()
  if (!emailValue)
    return
  const codeValue = validateEmailCaptcha()
  if (!codeValue)
    return

  const nameValue = name.value.trim()
  if (!nameValue) {
    error.value = '请填写昵称'
    return
  }
  if (!validatePasswordPair(password.value, confirmPassword.value))
    return

  loading.value = true
  try {
    await register({
      name: nameValue,
      email: emailValue,
      password: password.value,
      confirm: confirmPassword.value,
      captcha: codeValue,
    })
    switchEmailSubMode('login')
    success.value = '注册成功，请使用 QQ 邮箱验证码登录'
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '注册失败，请重试'
  }
  finally {
    loading.value = false
  }
}

async function onSubmitReset() {
  clearMessages()

  const emailValue = validateEmail()
  if (!emailValue)
    return
  const codeValue = validateEmailCaptcha()
  if (!codeValue)
    return
  if (!validatePasswordPair(password.value, confirmPassword.value))
    return

  loading.value = true
  try {
    await resetPassword({
      email: emailValue,
      captcha: codeValue,
      password: password.value,
      confirm: confirmPassword.value,
    })
    switchEmailSubMode('login')
    success.value = '密码已重置，请登录'
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : '重置失败，请重试'
  }
  finally {
    loading.value = false
  }
}

function onSubmit() {
  if (loginTab.value === 'account')
    return onSubmitAccountLogin()
  if (emailSubMode.value === 'register')
    return onSubmitRegister()
  if (emailSubMode.value === 'reset')
    return onSubmitReset()
  return onSubmitEmailLogin()
}
</script>

<template>
  <div class="subpage subpage--signin">
    <div class="signin card">
      <div class="signin__tabs" role="tablist" aria-label="登录方式">
        <button
          type="button"
          role="tab"
          class="signin__tab"
          :class="{ 'signin__tab--active': loginTab === 'email' }"
          :aria-selected="loginTab === 'email'"
          @click="switchLoginTab('email')"
        >
          QQ 邮箱登录
        </button>
        <button
          type="button"
          role="tab"
          class="signin__tab"
          :class="{ 'signin__tab--active': loginTab === 'account' }"
          :aria-selected="loginTab === 'account'"
          @click="switchLoginTab('account')"
        >
          账号登录
        </button>
      </div>

      <form class="signin__form" @submit.prevent="onSubmit">
        <h1 class="signin__form-title">{{ formTitle }}</h1>

        <p v-if="error" class="signin__alert signin__alert--error">
          {{ error }}
        </p>
        <p v-else-if="success" class="signin__alert signin__alert--success">
          {{ success }}
        </p>
        <p v-else-if="sentHint && loginTab === 'email'" class="signin__alert signin__alert--success">
          {{ sentHint }}
        </p>

        <template v-if="loginTab === 'account'">
          <label class="signin__field">
            <span class="signin__label">用户名</span>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="请输入用户名"
              required
            >
          </label>

          <label class="signin__field">
            <span class="signin__label">密码</span>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="请输入密码"
              required
            >
          </label>

          <label class="signin__field">
            <span class="signin__label">验证码</span>
            <div class="signin__captcha-row">
              <input
                v-model="imageCaptchaCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="6 位数字"
                required
              >
              <button
                type="button"
                class="signin__captcha-img-btn"
                title="点击刷新验证码"
                @click="refreshImageCaptcha"
              >
                <img
                  v-if="captchaImageSrc"
                  :src="captchaImageSrc"
                  alt="验证码"
                  class="signin__captcha-img"
                >
                <span v-else class="signin__captcha-placeholder">加载中</span>
              </button>
            </div>
          </label>
        </template>

        <template v-else>
          <label v-if="emailSubMode === 'register'" class="signin__field">
            <span class="signin__label">昵称</span>
            <input
              v-model="name"
              type="text"
              maxlength="32"
              autocomplete="username"
              placeholder="你的昵称"
              required
            >
          </label>

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
            <span class="signin__label">邮箱验证码</span>
            <div class="signin__code-row">
              <input
                v-model="emailCaptcha"
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

          <label v-if="emailSubMode === 'register' || emailSubMode === 'reset'" class="signin__field">
            <span class="signin__label">{{ emailSubMode === 'reset' ? '新密码' : '密码' }}</span>
            <input
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="至少 6 位"
              required
            >
          </label>

          <label v-if="emailSubMode === 'register' || emailSubMode === 'reset'" class="signin__field">
            <span class="signin__label">确认密码</span>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="再次输入密码"
              required
            >
          </label>
        </template>

        <button type="submit" class="signin__submit" :disabled="loading">
          {{ submitLabel }}
        </button>

        <p v-if="loginTab === 'email'" class="signin__switch">
          <template v-if="emailSubMode === 'login'">
            还没有账号？
            <button type="button" class="signin__switch-link" @click="switchEmailSubMode('register')">
              立即注册
            </button>
            <span class="signin__switch-sep">·</span>
            <button type="button" class="signin__switch-link" @click="switchEmailSubMode('reset')">
              忘记密码
            </button>
          </template>
          <template v-else>
            已有账号？
            <button type="button" class="signin__switch-link" @click="switchEmailSubMode('login')">
              返回登录
            </button>
          </template>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.subpage--signin {
  max-width: 28rem;
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
  padding: 1.75rem 1.5rem 2rem;
}

.signin__tabs {
  display: flex;
  margin-bottom: 1.5rem;
  padding: 0.25rem;
  border-radius: 12px;
  background: rgb(0 0 0 / 4%);
}

.signin__tab {
  flex: 1;
  padding: 0.55rem 0.5rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.signin__tab:hover {
  color: #374151;
}

.signin__tab--active {
  background: #fff;
  color: var(--home-accent-dark);
  box-shadow: 0 1px 4px rgb(0 0 0 / 8%);
}

.signin__form {
  width: 100%;
}

.signin__form-title {
  margin: 0 0 1.25rem;
  font-size: 1.35rem;
  font-weight: 700;
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
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 10px;
  background: rgb(255 255 255 / 80%);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.signin__field input:focus {
  border-color: var(--home-accent);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 18%);
}

.signin__code-row,
.signin__captcha-row {
  display: flex;
  gap: 0.5rem;
}

.signin__code-row input,
.signin__captcha-row input {
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

.signin__captcha-img-btn {
  flex-shrink: 0;
  width: 7.5rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
}

.signin__captcha-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.signin__captcha-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 0.75rem;
  color: #9ca3af;
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

.signin__switch {
  margin: 1rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.signin__switch-link {
  padding: 0;
  border: none;
  background: none;
  color: var(--home-accent-dark);
  font-size: inherit;
  font-weight: 600;
  cursor: pointer;
}

.signin__switch-link:hover {
  color: var(--home-accent);
  text-decoration: underline;
}

.signin__switch-sep {
  margin: 0 0.35rem;
}
</style>
