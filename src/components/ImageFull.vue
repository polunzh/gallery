<script setup lang="ts">
defineProps<{
  src: string
  caption?: string
  description?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="image-full">
    <div
      class="image-wrapper"
      role="button"
      tabindex="0"
      @click="$emit('click')"
      @keydown.enter="$emit('click')"
      @keydown.space.prevent="$emit('click')"
    >
      <img :src="src" :alt="caption || ''" loading="lazy">
    </div>
    <div v-if="caption || description" class="info">
      <p v-if="caption" class="caption">{{ caption }}</p>
      <p v-if="description" class="description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.image-full {
  margin: var(--space-2xl) 0;
}

.image-wrapper {
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) ease;
  outline: none;
}

.image-wrapper:focus-visible {
  outline: 2px solid var(--border-accent);
  outline-offset: 2px;
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
  margin-top: 16px;
  text-align: center;
}

.caption {
  font-family: var(--font-display);
  font-size: 14px;
  color: var(--text-accent);
  letter-spacing: 0.06em;
}

.description {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

@media (max-width: 767px) {
  .caption {
    font-size: 15px;
  }
  .description {
    font-size: 13px;
  }
}
</style>
