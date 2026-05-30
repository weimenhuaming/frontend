<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '推荐分享 · Chenaqi Blog' })

const searchTerm = ref('')
const selectedTag = ref('all')

const tags = ['图片', 'AI', 'CSS', 'Github', '工具']

const shares = [
  {
    name: 'iLoveIMG',
    url: 'https://www.iloveimg.com',
    description: '在线图片压缩、裁剪、格式转换等常用工具集合。',
    rating: 5,
    tags: ['图片', '工具'],
  },
  {
    name: 'Cursor',
    url: 'https://cursor.com',
    description: 'AI 驱动的代码编辑器，适合日常开发与 Agent 协作。',
    rating: 5,
    tags: ['AI', '工具'],
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    description: '开源代码托管与协作平台。',
    rating: 5,
    tags: ['Github'],
  },
]

const filteredShares = computed(() => {
  return shares.filter((share) => {
    const matchesSearch = !searchTerm.value
      || share.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      || share.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesTag = selectedTag.value === 'all' || share.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  })
})
</script>

<template>
  <div class="subpage">
    <header class="subpage__header">
      <input
        v-model="searchTerm"
        type="search"
        class="subpage__search"
        placeholder="搜索资源..."
      >

      <div class="subpage__tags">
        <button
          type="button"
          class="subpage__tag"
          :class="{ 'subpage__tag--active': selectedTag === 'all' }"
          @click="selectedTag = 'all'"
        >
          全部
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="subpage__tag"
          :class="{ 'subpage__tag--active': selectedTag === tag }"
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </header>

    <div class="subpage__grid">
      <article
        v-for="share in filteredShares"
        :key="share.url"
        class="subpage__card card"
      >
        <div class="subpage__card-head">
          <div class="subpage__card-icon" aria-hidden="true">🔗</div>
          <div class="subpage__card-meta">
            <h2 class="subpage__card-title">{{ share.name }}</h2>
            <a
              :href="share.url"
              target="_blank"
              rel="noopener noreferrer"
              class="subpage__card-url"
            >
              {{ share.url }}
            </a>
          </div>
        </div>

        <div class="subpage__stars" aria-label="评分">
          <span
            v-for="star in 5"
            :key="star"
            class="subpage__star"
            :class="{ 'subpage__star--filled': star <= share.rating }"
          >
            ★
          </span>
        </div>

        <div class="subpage__card-tags">
          <span
            v-for="tag in share.tags"
            :key="tag"
            class="subpage__card-tag"
          >
            {{ tag }}
          </span>
        </div>

        <p class="subpage__card-desc">{{ share.description }}</p>
      </article>
    </div>

    <p v-if="filteredShares.length === 0" class="subpage__empty">
      没有找到相关资源
    </p>
  </div>
</template>

<style scoped>
.subpage__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.subpage__search {
  width: min(100%, 28rem);
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgb(255 255 255 / 80%);
  background: rgb(255 255 255 / 55%);
  backdrop-filter: blur(12px);
  font-size: 0.95rem;
  outline: none;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.subpage__search:focus {
  border-color: var(--home-accent);
  box-shadow: 0 0 0 3px rgb(20 184 166 / 18%);
}

.subpage__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.subpage__tag {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: none;
  background: rgb(255 255 255 / 55%);
  color: #4b5563;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.subpage__tag:hover {
  background: rgb(255 255 255 / 80%);
}

.subpage__tag--active {
  background: var(--home-accent);
  color: #fff;
}

.subpage__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.card {
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: 0 6px 24px var(--home-shadow);
}

.subpage__card {
  padding: 1.1rem 1.15rem;
  transition: transform 0.15s, box-shadow 0.15s;
}

.subpage__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px var(--home-shadow);
}

.subpage__card-head {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  margin-bottom: 0.65rem;
}

.subpage__card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--home-accent-pale);
  font-size: 1.1rem;
}

.subpage__card-meta {
  min-width: 0;
}

.subpage__card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.subpage__card-url {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.72rem;
  color: var(--home-accent-dark);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subpage__stars {
  display: flex;
  gap: 0.15rem;
  margin-bottom: 0.55rem;
}

.subpage__star {
  color: #d1d5db;
  font-size: 0.85rem;
}

.subpage__star--filled {
  color: #fbbf24;
}

.subpage__card-desc {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #6b7280;
}

.subpage__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.subpage__card-tag {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--home-accent-pale);
  color: var(--home-accent-dark);
  font-size: 0.7rem;
  font-weight: 600;
}

.subpage__empty {
  margin-top: 2rem;
  text-align: center;
  color: #9ca3af;
}
</style>
