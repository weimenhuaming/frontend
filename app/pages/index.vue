<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: 'Chenaqi Blog' })

const GITHUB_URL = 'https://github.com/weimenhuaming'
const BILIBILI_URL = 'https://space.bilibili.com'
const EMAIL_URL = 'mailto:hello@chenaqi.tech'

const now = ref(new Date())

const greeting = computed(() => {
  const h = now.value.getHours()
  if (h < 12)
    return 'Good Morning'
  if (h < 18)
    return 'Good Afternoon'
  return 'Good Evening'
})

const randomRecommend = {
  tag: '随机推荐',
  title: 'CMU 15-445',
  subtitle: '& 大数据',
  desc: '一些Lab、笔记、文档笔记、讨论…',
  meta: 'Views: 18,367  Marks: 120',
}

const GREET_AVATAR = '/images/avatar.png'
const HERO_IMAGE = '/images/hero-sky.png'

let greetTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  greetTimer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onUnmounted(() => {
  if (greetTimer)
    clearInterval(greetTimer)
})
</script>

<template>
  <div class="bento">
    <main class="bento__center">
      <div class="bento__hero card">
        <img
          :src="HERO_IMAGE"
          alt="晴空与云朵"
          class="bento__hero-img"
          loading="eager"
          decoding="async"
        >
      </div>

      <div class="bento__greet card">
        <div
          class="bento__greet-avatar"
          role="img"
          aria-label="Chenaqi"
          :style="{ backgroundImage: `url('${GREET_AVATAR}')` }"
        />
        <p class="bento__greet-text">
          {{ greeting }}<br>
          I'm <strong>Chenaqi</strong>, Nice to<br>
          meet you!
        </p>
      </div>

      <div class="bento__social">
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="bento__social-link"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Github
        </a>
        <a
          :href="BILIBILI_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="bento__social-link bento__social-link--bili"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zm.027 14.747a3.36 3.36 0 0 0 2.453-1 3.36 3.36 0 0 0 1.013-2.467V9.853a3.36 3.36 0 0 0-1-2.453 3.36 3.36 0 0 0-2.453-1H6.187a3.36 3.36 0 0 0-2.467 1 3.36 3.36 0 0 0-1 2.467v6.067a3.36 3.36 0 0 0 1 2.453 3.36 3.36 0 0 0 2.467 1l11.653.013zM8.6 12.987c.36 0 .664.124.913.373s.378.567.387.953-.116.713-.373.987-.582.391-.973.391-.703-.124-.973-.378-.391-.582-.391-.973.124-.703.391-.973.617-.378.973-.378.027 0 .027 0c-.027 0-.027 0-.027 0zm6.787 0c.36 0 .671.124.927.373s.391.567.391.953-.124.713-.391.987-.591.391-.973.391-.704-.124-.973-.378-.391-.582-.391-.973.124-.703.391-.973.617-.378.973-.378-.027 0-.027 0c.027 0 .054 0 .081 0z" />
          </svg>
          bilibili
        </a>
        <a
          :href="EMAIL_URL"
          class="bento__social-icon"
          aria-label="Email"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="m2 7 10 6 10-6" />
          </svg>
        </a>
      </div>

      <div class="bento__bottom">
        <HomeLikeButton class="bento__like" />

        <NuxtLink to="/share" class="bento__recommend card">
          <span class="bento__recommend-icon" aria-hidden="true">
            <span>CMU</span>
            <span class="bento__recommend-icon-sub">15-445</span>
          </span>

          <div class="bento__recommend-info">
            <p class="bento__recommend-title">
              {{ randomRecommend.title }}
              <span class="bento__recommend-subtitle">{{ randomRecommend.subtitle }}</span>
            </p>
            <p class="bento__recommend-tag">{{ randomRecommend.tag }}</p>
          </div>

          <span class="bento__recommend-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </NuxtLink>

        <HomeMusic class="bento__music" />
      </div>
    </main>

    <aside class="bento__right">
      <HomeClock />
      <HomeCalendar />
      <HomeBentoDecor class="bento__city" />
    </aside>
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: minmax(0, 400px) 265px;
  gap: 1rem;
  align-items: start;
}

.bento__center {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  grid-column: 1;
}

.bento__right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  grid-column: 2;
  align-self: center;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.bento__hero {
  overflow: hidden;
  padding: 0;
  min-height: 130px;
}

.bento__hero-img {
  display: block;
  width: 100%;
  min-height: 130px;
  object-fit: cover;
  object-position: center;
}

.bento__greet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.15rem;
  padding: 1.85rem 1.5rem 2rem;
  min-height: 240px;
  text-align: center;
  backdrop-filter: none;
  background: rgb(255 255 255 / 85%);
}

.bento__greet-avatar {
  width: 5.75rem;
  height: 5.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--home-accent-light);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 5px solid #fff;
  box-shadow: 0 10px 28px rgb(20 184 166 / 30%);
}

.bento__greet-text {
  font-size: 1.2rem;
  color: #1a1a1a;
  line-height: 1.65;
  font-weight: 500;
}

.bento__greet-text strong {
  color: var(--home-accent-dark);
  font-weight: 700;
  font-size: 1.35rem;
  padding: 0 0.15rem;
}

.bento__social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.25rem 0;
}

.bento__social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 14px;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
  box-shadow: 0 4px 14px rgb(0 0 0 / 12%);
}

.bento__social-link:hover {
  transform: translateY(-1px);
  color: #fff;
}

.bento__social-link svg {
  width: 1.125rem;
  height: 1.125rem;
}

.bento__social-link--bili {
  background: #fb7299;
}

.bento__social-link--bili:hover {
  background: #f25d8e;
}

.bento__social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 14px;
  background: rgb(255 255 255 / 75%);
  color: var(--home-accent-dark);
  transition: transform 0.15s, background 0.15s;
  box-shadow: 0 4px 14px var(--home-shadow);
}

.bento__social-icon:hover {
  transform: translateY(-1px);
  background: #fff;
}

.bento__social-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.bento__bottom {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr) minmax(220px, auto);
  gap: 0.75rem;
  align-items: stretch;
  margin-left: calc(-235px - 1rem);
  width: calc(100% + 235px + 1rem);
}

.bento__like {
  align-self: center;
  justify-self: center;
  position: relative;
  left: 1.75rem;
  top: -1.25rem;
}

.bento__music {
  min-width: 0;
}

.bento__recommend {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  min-height: 100%;
  box-sizing: border-box;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}

.bento__recommend:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px var(--home-shadow);
}

.bento__recommend-icon {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 12px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  line-height: 1.05;
}

.bento__recommend-icon-sub {
  font-size: 0.44rem;
  font-weight: 600;
  opacity: 0.85;
}

.bento__recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.bento__recommend-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  word-break: break-word;
}

.bento__recommend-subtitle {
  font-size: 0.82rem;
  color: #1a1a1a;
  font-weight: 700;
}

.bento__recommend-tag {
  margin: 0;
  font-size: 0.68rem;
  color: #9ca3af;
  line-height: 1.3;
  word-break: break-word;
}

.bento__recommend-arrow {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--home-accent-soft), var(--home-accent));
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgb(20 184 166 / 35%);
}

.bento__recommend-arrow svg {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 960px) {
  .bento {
    grid-template-columns: 1fr;
  }

  .bento__center,
  .bento__right {
    grid-column: 1;
    align-self: stretch;
  }

  .bento__right {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 0;
  }

  .bento__city {
    margin-top: 0;
    grid-column: 1 / -1;
  }

  .bento__bottom {
    margin-left: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }

  .bento__like {
    justify-self: center;
    margin-bottom: 0.25rem;
    left: 0;
    top: 0;
  }

  .bento__music {
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .bento__right {
    grid-template-columns: 1fr;
  }
}
</style>
