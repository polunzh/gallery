<script setup lang="ts">
import { computed } from 'vue'
import type { Album } from '@/types/album'
import { useImageUrl } from '@/composables/useImageUrl'

const props = defineProps<{
  album: Album
}>()

const getUrl = useImageUrl(props.album.id)

const imageCount = computed(() => {
  let count = 0
  for (const entry of props.album.layout) {
    if (entry.type === 'hero' || entry.type === 'full') count++
    else if (entry.type === 'pair') count += entry.items.length
  }
  return count
})
</script>

<template>
  <RouterLink :to="`/${album.id}`" class="album-card">
    <div class="card-cover">
      <img :src="getUrl(album.cover)" :alt="album.title" loading="lazy">
      <span class="card-badge">{{ imageCount }} 张</span>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ album.title }}</h3>
      <span class="card-meta">{{ album.date }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.album-card {
  display: block;
  transition: transform var(--duration-fast) ease;
}

.album-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 21 / 9;
  position: relative;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-normal) var(--ease-out);
}

.album-card:hover .card-cover img {
  transform: scale(1.03);
}

.card-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 11px;
  color: rgba(232, 223, 210, 0.85);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
}

.card-info {
  padding: 14px 4px 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-accent-light);
}

.card-meta {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
