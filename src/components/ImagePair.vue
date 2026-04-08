<script setup lang="ts">
import type { ImageItem } from '@/types/album'
import BlurImage from './BlurImage.vue'

defineProps<{
  items: [ImageItem, ImageItem]
  getUrl: (src: string) => string
}>()

defineEmits<{
  click: [index: number]
}>()
</script>

<template>
  <div class="image-pair reveal">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="pair-item"
      role="button"
      tabindex="0"
      @click="$emit('click', i)"
      @keydown.enter="$emit('click', i)"
      @keydown.space.prevent="$emit('click', i)"
    >
      <div class="image-wrapper">
        <BlurImage :src="getUrl(item.src)" :alt="item.caption || ''" loading="lazy" />
      </div>
      <div v-if="item.caption || item.description" class="info">
        <p v-if="item.caption" class="caption">{{ item.caption }}</p>
        <p v-if="item.description" class="description">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: var(--space-2xl) 0;
}

.pair-item {
  outline: none;
}

.pair-item:focus-visible {
  outline: 2px solid var(--border-accent);
  outline-offset: 2px;
}

.image-wrapper {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) ease;
}

.image-wrapper:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
}

.image-wrapper :deep(.blur-image) {
  transition: transform var(--duration-normal) var(--ease-out);
}

.image-wrapper:hover :deep(.blur-image) {
  transform: scale(1.015);
}

/* Touch feedback */
.image-wrapper:active :deep(.blur-image) {
  transform: scale(0.98);
  opacity: 0.9;
}

@media (hover: none) {
  .image-wrapper:hover :deep(.blur-image) {
    transform: none;
  }
}

.info {
  margin-top: 12px;
  text-align: center;
}

.caption {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-accent);
  letter-spacing: 0.06em;
}

.description {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

@media (max-width: 767px) {
  .image-pair {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .caption {
    font-size: 15px;
  }

  .description {
    font-size: 13px;
  }
}
</style>
