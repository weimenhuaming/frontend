<script setup lang="ts">
definePageMeta({ layout: 'home' })

useSeoMeta({ title: '关于网站 · Chenaqi Blog' })
</script>

<template>
  <div class="subpage subpage--article">
    <article class="subpage__article card">
      <h1 class="subpage__title">关于网站</h1>
      <p>
        你好，我是 Chenaqi。
        这个博客用于记录我在技术、创作与生活中的思考与实践。
      </p>
      <p>
        如果你有任何想法或合作意向，欢迎通过页脚中的联系方式与我交流。
      </p>
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
  margin: 0 0 1.25rem;
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
}

.subpage__article p + p {
  margin-top: 1rem;
}
</style>
