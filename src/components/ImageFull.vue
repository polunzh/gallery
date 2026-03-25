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
    <div class="image-wrapper" @click="$emit('click')">
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
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
}

.image-wrapper img {
  width: 100%;
  transition: transform var(--duration-normal) var(--ease-out);
}

.image-wrapper:hover img {
  transform: scale(1.015);
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
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}
</style>
