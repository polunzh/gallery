<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
}>()

const loaded = ref(false)
const placeholderLoaded = ref(false)

// Generate placeholder URL (20px wide, same aspect ratio)
// For now, we use the same image but with a query param to indicate it's the small version
// In production, this would be a pre-generated tiny thumbnail
const placeholderSrc = computed(() => {
  // We'll use the same image for now - the blur effect will make it appear as a placeholder
  // In a full implementation, this would be a 20px wide version: src.replace('.jpg', '-thumb.jpg')
  return props.src
})

function onImageLoad() {
  loaded.value = true
}

function onPlaceholderLoad() {
  placeholderLoaded.value = true
}
</script>

<template>
  <div class="blur-image">
    <!-- Full resolution image - loads on top -->
    <img
      :src="src"
      :alt="alt"
      class="blur-image__full"
      :class="{ 'is-loaded': loaded }"
      :loading="loading || 'lazy'"
      @load="onImageLoad"
    >

    <!-- Blurred placeholder - shown until full image loads -->
    <img
      v-show="!loaded"
      :src="placeholderSrc"
      :alt="alt"
      class="blur-image__placeholder"
      loading="eager"
      @load="onPlaceholderLoad"
    >

    <!-- Skeleton loader shown initially -->
    <div v-if="!loaded && !placeholderLoaded" class="blur-image__skeleton"></div>
  </div>
</template>

<style scoped>
.blur-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-alt);
}

.blur-image__placeholder,
.blur-image__full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Blurred placeholder - tiny image scaled up with blur */
.blur-image__placeholder {
  filter: blur(20px) saturate(0.8);
  transform: scale(1.1); /* Slight scale to hide blur edges */
  transition: opacity var(--duration-normal) ease;
}

/* Full image - starts invisible, fades in when loaded */
.blur-image__full {
  opacity: 0;
  transition: opacity var(--duration-normal) ease;
}

.blur-image__full.is-loaded {
  opacity: 1;
}

/* Skeleton loader shown while placeholder loads */
.blur-image__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--bg-alt) 0%,
    var(--bg-elevated) 50%,
    var(--bg-alt) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .blur-image__placeholder,
  .blur-image__full {
    transition: none;
  }

  .blur-image__skeleton {
    animation: none;
    background: var(--bg-alt);
  }
}
</style>
