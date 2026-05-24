<!--
  layouts/default.vue — 默认布局（包裹所有页面）

  使用方式：
  1. 默认：所有 pages/ 下的页面会自动使用 default 布局
  2. 指定其他布局：在页面里写 definePageMeta({ layout: 'admin' })
     对应文件 layouts/admin.vue

  <slot />：子页面内容会插入到这里（即 NuxtPage 渲染的结果）
-->
<!--
  layouts/default.vue — 默认布局（包裹所有页面）

  使用方式：
  1. 默认：所有 pages/ 下的页面会自动使用 default 布局
  2. 指定其他布局：在页面里写 definePageMeta({ layout: 'admin' })
     对应文件 layouts/admin.vue

  <slot />：子页面内容会插入到这里（即 NuxtPage 渲染的结果）
-->
<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}
</style>
