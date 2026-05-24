<script setup lang="ts">
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1 class="page-header__title">关于</h1>
    </header>

    <article class="about">
      <p>
        你好，我是 cxy。
        这个博客用于记录我在技术、创作与生活中的思考与实践。
      </p>
      <p>
        如果你有任何想法或合作意向，欢迎通过页脚中的联系方式与我交流。
      </p>
    </article>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.page-header__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

.about {
  max-width: 40rem;
  font-size: 1.0625rem;
  line-height: 1.8;
  color: var(--color-text);
}

.about p + p {
  margin-top: 1rem;
}
</style>
