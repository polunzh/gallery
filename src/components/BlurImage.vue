<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
}>()

const loaded = ref(false)

function onImageLoad() {
  loaded.value = true
}
</script>

<template>
  <div class="blur-image">
    <img
      :src="src"
      :alt="alt || ''"
      class="blur-image__img"
      :class="{ 'is-loaded': loaded }"
      :loading="loading || 'lazy'"
      @load="onImageLoad"
    >
  </div>
</template>

<style scoped>
.blur-image {
  width: 100%;
  height: 100%;
}

.blur-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: block;
}

.blur-image__img.is-loaded {
  opacity: 1;
}

/* For SSR: show image immediately if JS hasn't loaded */
@media (scripting: none) {
  .blur-image__img {
    opacity: 1;
  }
}
</style>
