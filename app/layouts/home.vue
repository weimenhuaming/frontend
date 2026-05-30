<script setup lang="ts">
const route = useRoute()

const isHome = computed(() => route.path === '/')
</script>

<template>
  <div
    class="home-layout"
    :class="{ 'home-layout--subpage': !isHome }"
  >
    <div class="home-layout__body">
      <div class="home-shell">
        <div class="home-shell__sidebar-wrap">
          <HomeDailyQuote v-if="isHome" class="home-shell__quote" />
          <HomeSidebar />
        </div>
        <main :key="route.path" class="home-shell__main">
          <slot />
        </main>
      </div>
    </div>
    <AppFooter theme="home" />
  </div>
</template>

<style>
.home-layout {
  --home-accent: #14b8a6;
  --home-accent-dark: #0d9488;
  --home-accent-light: #ccfbf1;
  --home-accent-soft: #99f6e4;
  --home-accent-pale: #f0fdfa;
  --home-shadow: rgb(20 184 166 / 12%);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5 0%, #ccfbf1 30%, #e0f2fe 60%, #fefce8 100%);
  background-attachment: fixed;
}

.home-layout__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.home-shell {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr);
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: min(1020px, 100%);
  margin: 0 auto;
  padding: 1.75rem 1.5rem 2rem;
  flex: 1;
  box-sizing: border-box;
}

.home-shell__sidebar-wrap {
  position: relative;
  align-self: center;
  width: 235px;
  margin-top: calc(1.25rem + 1cm);
}

.home-shell__quote {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 1rem);
}

.home-shell__main {
  min-width: 0;
}

.home-layout--subpage .home-shell {
  display: block;
  width: 100%;
  max-width: none;
  padding: 0;
}

.home-layout--subpage .home-shell__sidebar-wrap {
  height: 0;
  overflow: visible;
}

.home-layout--subpage .home-shell__main {
  padding: 5.5rem 1.5rem 3rem;
  max-width: 72rem;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .home-shell {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .home-shell__sidebar-wrap {
    width: 100%;
  }

  .home-shell__quote {
    position: static;
    margin-bottom: 1rem;
  }

  .home-layout--subpage .home-shell__main {
    padding-top: 6.5rem;
  }
}
</style>
