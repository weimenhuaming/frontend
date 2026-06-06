<script setup lang="ts">
import type { ArticleInfo } from '~/api/article'
import { resolveMediaUrl } from '~/utils/media'

const props = defineProps<{
  article: ArticleInfo
  placeholder?: string
}>()

const config = useRuntimeConfig()

const coverUrl = computed(() =>
  resolveMediaUrl(props.article.cover, config.public.apiBase),
)

const articleLink = computed(() => `/blog/${props.article.id}`)
</script>

<template>
  <li class="admin-list__item admin-list__item--article">
    <NuxtLink
      :to="articleLink"
      class="admin-list__thumb-wrap"
      :aria-label="`${article.title} 封面`"
    >
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="article.title"
        class="admin-list__thumb"
      >
      <div v-else class="admin-list__thumb admin-list__thumb--placeholder">
        <span>{{ placeholder || 'Blog' }}</span>
      </div>
    </NuxtLink>

    <div class="admin-list__article-main">
      <NuxtLink :to="articleLink" class="admin-list__article-title">
        {{ article.title }}
      </NuxtLink>
      <div class="admin-list__article-meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.actions" class="admin-list__actions">
      <slot name="actions" />
    </div>
  </li>
</template>
