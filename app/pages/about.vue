<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '关于网站 · Chenaqi Blog' })

const GITHUB_URL = 'https://github.com/weimenhuaming'
const BILIBILI_URL = 'https://space.bilibili.com'
const EMAIL_URL = 'mailto:hello@chenaqi.tech'
const AVATAR_URL = '/images/avatar.png'

const features = [
  {
    icon: 'article',
    title: '文章专栏',
    desc: '阅读技术笔记、学习心得与生活随想，支持分类筛选与全文搜索。',
    to: '/blog',
    label: '浏览文章',
  },
  {
    icon: 'ai',
    title: '站内助手',
    desc: '基于个人知识库的智能问答，快速了解博客内容与站点信息。',
    to: '/agent',
    label: '开始对话',
  },
  {
    icon: 'home',
    title: '个人主页',
    desc: 'Bento 风格首页，汇集时钟、日历、音乐与每日推荐等内容。',
    to: '/',
    label: '回到首页',
  },
]

const techStack = [
  'Vue 3',
  'Nuxt 4',
  'TypeScript',
  'Pinia',
  'Go',
  'go-zero',
  'gRPC',
  'Redis',
  'LangChainGo',
  'Chroma',
]

const highlights = [
  { value: '博客', label: '内容创作与分享' },
  { value: 'RAG', label: '知识库智能问答' },
  { value: 'SSR', label: '服务端渲染体验' },
  { value: 'Open', label: '持续迭代更新' },
]
</script>

<template>
  <div class="about">
    <section class="about__hero card">
      <div
        class="about__avatar"
        role="img"
        aria-label="Chenaqi"
        :style="{ backgroundImage: `url('${AVATAR_URL}')` }"
      />
      <div class="about__hero-body">
        <p class="about__eyebrow">About · Chenaqi Blog</p>
        <h1 class="about__title">你好，我是 Chenaqi</h1>
        <p class="about__lead">
          这个站点是我的个人博客与数字花园，用来记录技术探索、创作实践与生活中的点滴思考。
          希望这些内容能对你有所启发，也欢迎随时交流。
        </p>
        <div class="about__social">
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="about__social-link"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            :href="BILIBILI_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="about__social-link about__social-link--bili"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zm.027 14.747a3.36 3.36 0 0 0 2.453-1 3.36 3.36 0 0 0 1.013-2.467V9.853a3.36 3.36 0 0 0-1-2.453 3.36 3.36 0 0 0-2.453-1H6.187a3.36 3.36 0 0 0-2.467 1 3.36 3.36 0 0 0-1 2.467v6.067a3.36 3.36 0 0 0 1 2.453 3.36 3.36 0 0 0 2.467 1l11.653.013zM8.6 12.987c.36 0 .664.124.913.373s.378.567.387.953-.116.713-.373.987-.582.391-.973.391-.703-.124-.973-.378-.391-.582-.391-.973.124-.703.391-.973.617-.378.973-.378.027 0 .027 0c-.027 0-.027 0-.027 0zm6.787 0c.36 0 .671.124.927.373s.391.567.391.953-.124.713-.391.987-.591.391-.973.391-.704-.124-.973-.378-.391-.582-.391-.973.124-.703.391-.973.617-.378.973-.378-.027 0-.027 0c.027 0 .054 0 .081 0z" />
            </svg>
            bilibili
          </a>
          <a :href="EMAIL_URL" class="about__social-icon" aria-label="发送邮件">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="m2 7 10 6 10-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <section class="about__stats">
      <div
        v-for="item in highlights"
        :key="item.label"
        class="about__stat card"
      >
        <p class="about__stat-value">{{ item.value }}</p>
        <p class="about__stat-label">{{ item.label }}</p>
      </div>
    </section>

    <section class="about__grid">
      <article class="about__story card">
        <h2 class="about__section-title">关于本站</h2>
        <p>
          Chenaqi Blog 是一个集阅读、互动与智能问答于一体的个人站点。
          在这里，你可以浏览我写的技术文章，通过评论与点赞参与讨论，
          也可以向站内助手提问，快速检索博客中的相关知识。
        </p>
        <p>
          站点采用前后端分离架构：前端使用 Nuxt 提供流畅的浏览体验，
          后端基于 go-zero 构建 API 服务，并接入 RAG 知识库问答能力。
          我会持续更新内容与功能，让它成为更实用的个人知识空间。
        </p>
        <blockquote class="about__quote">
          「记录，是为了更好地思考；分享，是为了遇见同路人。」
        </blockquote>
      </article>

      <div class="about__features">
        <NuxtLink
          v-for="feature in features"
          :key="feature.to"
          :to="feature.to"
          class="about__feature card"
        >
          <span class="about__feature-icon" aria-hidden="true">
            <svg v-if="feature.icon === 'article'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M8 7h8M8 11h8M8 15h5" />
            </svg>
            <svg v-else-if="feature.icon === 'ai'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6V4" />
              <rect x="4" y="6" width="16" height="12" rx="2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
            </svg>
          </span>
          <div class="about__feature-body">
            <h3 class="about__feature-title">{{ feature.title }}</h3>
            <p class="about__feature-desc">{{ feature.desc }}</p>
            <span class="about__feature-link">{{ feature.label }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="about__tech card">
      <h2 class="about__section-title">技术栈</h2>
      <p class="about__tech-desc">
        站点由以下技术构建与驱动，兼顾开发效率、性能与可扩展性。
      </p>
      <div class="about__tech-tags">
        <span
          v-for="tag in techStack"
          :key="tag"
          class="about__tech-tag"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <section class="about__cta card">
      <div class="about__cta-body">
        <h2 class="about__cta-title">想聊聊？</h2>
        <p class="about__cta-desc">
          无论是技术交流、内容合作，还是对站点的建议，都欢迎联系我。
        </p>
      </div>
      <a :href="EMAIL_URL" class="about__cta-btn">
        hello@chenaqi.tech
      </a>
    </section>
  </div>
</template>

<style scoped>
.about {
  margin-top: -1cm;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.about__hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.75rem;
  align-items: center;
  padding: 2rem 2.25rem;
  background: linear-gradient(135deg, rgb(255 255 255 / 88%) 0%, var(--home-accent-pale) 100%);
}

.about__avatar {
  width: 7rem;
  height: 7rem;
  flex-shrink: 0;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 8px 24px var(--home-shadow);
  background-color: var(--home-accent-light);
  background-size: cover;
  background-position: center;
}

.about__eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--home-accent-dark);
}

.about__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.about__lead {
  margin: 0;
  max-width: 38rem;
  font-size: 1rem;
  line-height: 1.8;
  color: #4b5563;
}

.about__social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

.about__social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #24292f;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s, opacity 0.15s;
}

.about__social-link:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

.about__social-link svg {
  width: 1rem;
  height: 1rem;
}

.about__social-link--bili {
  background: #fb7299;
}

.about__social-icon {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgb(255 255 255 / 80%);
  border: 1px solid rgb(255 255 255 / 90%);
  color: #4b5563;
  text-decoration: none;
  transition: transform 0.15s, color 0.15s, background 0.15s;
}

.about__social-icon:hover {
  transform: translateY(-1px);
  color: var(--home-accent-dark);
  background: #fff;
}

.about__social-icon svg {
  width: 1.1rem;
  height: 1.1rem;
}

.about__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.about__stat {
  padding: 1.1rem 1rem;
  text-align: center;
}

.about__stat-value {
  margin: 0 0 0.25rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--home-accent-dark);
}

.about__stat-label {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.about__story {
  padding: 1.75rem 2rem;
  font-size: 1rem;
  line-height: 1.85;
  color: #374151;
}

.about__section-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
}

.about__story p {
  margin: 0;
}

.about__story p + p {
  margin-top: 1rem;
}

.about__quote {
  margin: 1.35rem 0 0;
  padding: 0.9rem 1.1rem;
  border-left: 3px solid var(--home-accent);
  border-radius: 0 12px 12px 0;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.9375rem;
  font-weight: 500;
}

.about__features {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.about__feature {
  display: flex;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.about__feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px var(--home-shadow);
}

.about__feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
}

.about__feature-icon svg {
  width: 1.2rem;
  height: 1.2rem;
}

.about__feature-title {
  margin: 0 0 0.3rem;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.about__feature-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: #6b7280;
}

.about__feature-link {
  display: inline-block;
  margin-top: 0.55rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--home-accent-dark);
}

.about__tech {
  padding: 1.75rem 2rem;
}

.about__tech-desc {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #6b7280;
}

.about__tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.about__tech-tag {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 75%);
  border: 1px solid var(--home-accent-light);
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
}

.about__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, var(--home-accent-pale) 0%, rgb(255 255 255 / 85%) 100%);
}

.about__cta-title {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
}

.about__cta-desc {
  margin: 0;
  font-size: 0.9375rem;
  color: #6b7280;
}

.about__cta-btn {
  flex-shrink: 0;
  padding: 0.7rem 1.25rem;
  border-radius: 999px;
  background: var(--home-accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
}

.about__cta-btn:hover {
  background: var(--home-accent-dark);
  transform: translateY(-1px);
}

@media (max-width: 960px) {
  .about__hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .about__lead {
    margin-inline: auto;
  }

  .about__social {
    justify-content: center;
  }

  .about__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__grid {
    grid-template-columns: 1fr;
  }

  .about__cta {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
}

@media (max-width: 560px) {
  .about__hero,
  .about__story,
  .about__tech,
  .about__cta {
    padding-inline: 1.35rem;
  }
}
</style>
