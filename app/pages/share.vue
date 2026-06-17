<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '分享与友链 · Chenaqi Blog' })

interface FriendLink {
  name: string
  url: string
  desc: string
  avatar?: string
  tag?: string
}

const friendLinks: FriendLink[] = [
  {
    name: '青冥博客',
    url: 'http://qingming.cloud/',
    desc: '记录技术与生活的个人博客，分享学习笔记与创作实践。',
    tag: '博客',
  },
]

const siteInfo = {
  name: 'Chenaqi Blog',
  url: 'https://chenaqi.tech',
  desc: '个人博客与数字花园，记录技术探索、创作实践与生活思考。',
}
</script>

<template>
  <div class="share">
    <section class="share__hero card">
      <p class="share__eyebrow">Share · Chenaqi Blog</p>
      <h1 class="share__title">分享与友链</h1>
      <p class="share__lead">
        这里汇集了我愿意推荐的内容与友站链接。如果你也喜欢记录与分享，欢迎互换友链。
      </p>
    </section>

    <section class="share__section">
      <div class="share__section-head">
        <h2 class="share__section-title">友情链接</h2>
        <p class="share__section-desc">一些值得关注与回访的站点</p>
      </div>

      <div class="share__links">
        <a
          v-for="link in friendLinks"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="share__link card"
        >
          <span class="share__link-avatar" aria-hidden="true">
            {{ link.name.slice(0, 1) }}
          </span>
          <div class="share__link-body">
            <div class="share__link-head">
              <h3 class="share__link-name">{{ link.name }}</h3>
              <span v-if="link.tag" class="share__link-tag">{{ link.tag }}</span>
            </div>
            <p class="share__link-desc">{{ link.desc }}</p>
            <span class="share__link-url">{{ link.url.replace(/^https?:\/\//, '') }}</span>
          </div>
          <span class="share__link-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </a>
      </div>
    </section>

    <section class="share__apply card">
      <div class="share__apply-body">
        <h2 class="share__section-title">申请友链</h2>
        <p class="share__apply-desc">
          欢迎互换友链。请确保站点内容健康、持续更新，并在你的站点添加本站链接后联系我。
        </p>
        <dl class="share__site-info">
          <div class="share__site-row">
            <dt>站点名称</dt>
            <dd>{{ siteInfo.name }}</dd>
          </div>
          <div class="share__site-row">
            <dt>站点地址</dt>
            <dd>{{ siteInfo.url }}</dd>
          </div>
          <div class="share__site-row">
            <dt>站点描述</dt>
            <dd>{{ siteInfo.desc }}</dd>
          </div>
        </dl>
      </div>
      <NuxtLink to="/blog" class="share__apply-btn">
        浏览本站文章
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.share {
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

.share__hero {
  padding: 2rem 2.25rem;
  background: linear-gradient(135deg, rgb(255 255 255 / 88%) 0%, var(--home-accent-pale) 100%);
}

.share__eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--home-accent-dark);
}

.share__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.share__lead {
  margin: 0;
  max-width: 38rem;
  font-size: 1rem;
  line-height: 1.8;
  color: #4b5563;
}

.share__section-head {
  margin-bottom: 0.85rem;
}

.share__section-title {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
}

.share__section-desc {
  margin: 0;
  font-size: 0.9375rem;
  color: #6b7280;
}

.share__links {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.share__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  color: inherit;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}

.share__link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px var(--home-shadow);
}

.share__link-avatar {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--home-accent-soft), var(--home-accent));
  color: #fff;
  font-size: 1.125rem;
  font-weight: 800;
}

.share__link-body {
  flex: 1;
  min-width: 0;
}

.share__link-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
}

.share__link-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.share__link-tag {
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.6875rem;
  font-weight: 600;
}

.share__link-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: #6b7280;
}

.share__link-url {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--home-accent-dark);
}

.share__link-arrow {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  transition: background 0.15s, color 0.15s;
}

.share__link:hover .share__link-arrow {
  background: var(--home-accent);
  color: #fff;
}

.share__link-arrow svg {
  width: 1rem;
  height: 1rem;
}

.share__apply {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, var(--home-accent-pale) 0%, rgb(255 255 255 / 85%) 100%);
}

.share__apply-desc {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #6b7280;
}

.share__site-info {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.share__site-row {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem;
  font-size: 0.8125rem;
}

.share__site-row dt {
  margin: 0;
  color: #9ca3af;
  font-weight: 500;
}

.share__site-row dd {
  margin: 0;
  color: #374151;
  font-weight: 500;
}

.share__apply-btn {
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

.share__apply-btn:hover {
  background: var(--home-accent-dark);
  transform: translateY(-1px);
}

@media (max-width: 960px) {
  .share__apply {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .share__hero,
  .share__apply {
    padding-inline: 1.35rem;
  }

  .share__site-row {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }
}
</style>
