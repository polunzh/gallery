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
  /* Linear-inspired subtle border */
  border: 1px solid var(--border-subtle);
  transition: all var(--duration-fast) ease;
}

.card-cover:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
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

/* Touch feedback */
.album-card:active .card-cover img {
  transform: scale(0.98);
  opacity: 0.9;
}

@media (hover: none) {
  .album-card:hover .card-cover img {
    transform: none;
  }
  .album-card:active .card-cover img {
    transform: scale(0.98);
  }
}

/* Spotify-inspired pill badge */
.card-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 12px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  border: 1px solid var(--border-subtle);
}

.card-info {
  padding: 16px 4px 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-accent-light);
  letter-spacing: -0.01em;
}

.card-meta {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 767px) {
  .card-title {
    font-size: 18px;
  }
  .card-meta {
    font-size: 13px;
  }
  .card-badge {
    font-size: 11px;
    padding: 5px 12px;
  }
}
</style>
