<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string
  name?: string
  size?: number
  alt?: string
}>(), {
  src: '',
  name: 'U',
  size: 40,
  alt: '',
})

const hasImage = computed(() => !!props.src?.trim())

const initial = computed(() =>
  (props.name?.trim().charAt(0) || 'U').toUpperCase(),
)

const pixelSize = computed(() => `${props.size}px`)
</script>

<template>
  <img
    v-if="hasImage"
    :src="src"
    :alt="alt || name"
    class="user-avatar user-avatar--image"
    :width="size"
    :height="size"
  >
  <span
    v-else
    class="user-avatar user-avatar--fallback"
    :aria-label="alt || name"
    role="img"
  >
    {{ initial }}
  </span>
</template>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: v-bind(pixelSize);
  height: v-bind(pixelSize);
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgb(20 184 166 / 22%);
}

.user-avatar--image {
  object-fit: cover;
}

.user-avatar--fallback {
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  color: #fff;
  font-weight: 700;
  font-size: calc(v-bind(pixelSize) * 0.42);
  line-height: 1;
  user-select: none;
}
</style>
