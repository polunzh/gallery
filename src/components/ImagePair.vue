<script setup lang="ts">
import type { ImageItem } from '@/types/album'

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
      @click="$emit('click', i)"
    >
      <div class="image-wrapper">
        <img :src="getUrl(item.src)" :alt="item.caption || ''" loading="lazy">
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

.image-wrapper img {
  width: 100%;
  transition: transform var(--duration-normal) var(--ease-out);
}

.image-wrapper:hover img {
  transform: scale(1.015);
}

/* Touch feedback */
.image-wrapper:active img {
  transform: scale(0.98);
  opacity: 0.9;
}

@media (hover: none) {
  .image-wrapper:hover img {
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
